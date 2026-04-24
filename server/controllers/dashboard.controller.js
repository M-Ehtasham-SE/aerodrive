const { Vehicle, Reservation, Payment, Contract, Maintenance, DamageReport, Insurance, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalVehicles, activeReservations, revenueToday, activeContracts, vehiclesMaintenance] = await Promise.all([
      Vehicle.count(),
      Reservation.count({ where: { Status: { [Op.in]: ['Confirmed', 'Active', 'Pending'] } } }),
      Payment.sum('Amount', { where: { PaymentDate: { [Op.between]: [today, tomorrow] }, PaymentStatus: 'Paid' } }),
      Contract.count({ where: { PaymentStatus: { [Op.ne]: 'Paid' } } }),
      Vehicle.count({ where: { Status: 'Maintenance' } })
    ]);

    res.json({
      success: true,
      data: {
        totalVehicles,
        activeReservations,
        revenueToday: revenueToday || 0,
        activeContracts,
        vehiclesMaintenance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch summary', error: error.message });
  }
};

exports.getUtilisation = async (req, res) => {
  try {
    const [available, rented, maintenance, reserved] = await Promise.all([
      Vehicle.count({ where: { Status: 'Available' } }),
      Vehicle.count({ where: { Status: 'Rented' } }),
      Vehicle.count({ where: { Status: 'Maintenance' } }),
      Vehicle.count({ where: { Status: 'Reserved' } })
    ]);

    res.json({
      success: true,
      data: [
        { name: 'Available', value: available, color: '#22C55E' },
        { name: 'Rented', value: rented, color: '#0EA5E9' },
        { name: 'Maintenance', value: maintenance, color: '#F59E0B' },
        { name: 'Reserved', value: reserved, color: '#A78BFA' }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch utilisation', error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const now = new Date();
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);

    const [overdueContracts, pendingDamage, expiringInsurance, dueMaintenance] = await Promise.all([
      Contract.count({ where: { ReturnDate: { [Op.lt]: now }, PaymentStatus: { [Op.ne]: 'Paid' } } }),
      DamageReport.count({ where: { Status: 'Pending' } }),
      Insurance.count({ where: { EndDate: { [Op.between]: [now, in30Days] }, Status: 'Active' } }),
      Maintenance.count({ where: { Status: 'Scheduled', ScheduledDate: { [Op.lte]: now } } })
    ]);

    const alerts = [];
    if (overdueContracts > 0) alerts.push({ type: 'danger', message: `${overdueContracts} overdue contract(s)` });
    if (pendingDamage > 0) alerts.push({ type: 'warning', message: `${pendingDamage} pending damage report(s)` });
    if (expiringInsurance > 0) alerts.push({ type: 'warning', message: `${expiringInsurance} insurance policy(ies) expiring within 30 days` });
    if (dueMaintenance > 0) alerts.push({ type: 'info', message: `${dueMaintenance} overdue scheduled maintenance job(s)` });

    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch alerts', error: error.message });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const revenue = await Payment.sum('Amount', {
        where: { PaymentDate: { [Op.between]: [start, end] }, PaymentStatus: 'Paid' }
      });
      months.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: revenue || 0
      });
    }
    res.json({ success: true, data: months });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch revenue', error: error.message });
  }
};
