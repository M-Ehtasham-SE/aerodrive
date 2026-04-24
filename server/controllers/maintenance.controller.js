const { Maintenance, MaintenancePart, Vehicle, Mechanic, Person, sequelize } = require('../models');

exports.getMaintenance = async (req, res) => {
  try {
    const { vehicleId, mechanicId, status } = req.query;
    let whereClause = {};
    if (vehicleId) whereClause.VehicleID = vehicleId;
    if (mechanicId) whereClause.MechanicID = mechanicId;
    if (status) whereClause.Status = status;
    const jobs = await Maintenance.findAll({
      where: whereClause,
      include: [Vehicle, { model: Mechanic, include: [{ model: Person, attributes: ['FirstName', 'LastName'] }] }, MaintenancePart]
    });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch maintenance', error: error.message });
  }
};

exports.createMaintenance = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { vehicleId, mechanicId, scheduledDate, serviceType, description, laborCost } = req.body;
    const job = await Maintenance.create({
      VehicleID: vehicleId, MechanicID: mechanicId, ScheduledDate: scheduledDate,
      ServiceType: serviceType, Description: description, LaborCost: laborCost, Status: 'Scheduled'
    }, { transaction: t });

    await Vehicle.update({ Status: 'Maintenance' }, { where: { VehicleID: vehicleId }, transaction: t });

    await t.commit();
    res.status(201).json({ success: true, message: 'Maintenance job created', data: job });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create maintenance', error: error.message });
  }
};

exports.updateMaintenance = async (req, res) => {
  try {
    const job = await Maintenance.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    await job.update(req.body);
    res.json({ success: true, message: 'Maintenance updated', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update maintenance', error: error.message });
  }
};

exports.completeMaintenance = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const job = await Maintenance.findByPk(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const parts = await MaintenancePart.findAll({ where: { MaintenanceID: job.MaintenanceID } });
    const partsCost = parts.reduce((sum, p) => sum + parseFloat(p.PartCost || 0) * parseInt(p.Quantity || 1), 0);
    const totalCost = parseFloat(job.LaborCost || 0) + partsCost;

    await job.update({ Status: 'Completed', CompletedDate: new Date(), PartsCost: partsCost, TotalCost: totalCost }, { transaction: t });
    await Vehicle.update({ Status: 'Available' }, { where: { VehicleID: job.VehicleID }, transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Maintenance completed', data: job });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to complete maintenance', error: error.message });
  }
};

exports.addPart = async (req, res) => {
  try {
    const part = await MaintenancePart.create({ MaintenanceID: req.params.id, ...req.body });
    res.status(201).json({ success: true, message: 'Part added', data: part });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add part', error: error.message });
  }
};
