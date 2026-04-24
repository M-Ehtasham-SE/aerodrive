const { Reservation, Vehicle, Customer, Person, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getReservations = async (req, res) => {
  try {
    const { status, from, to } = req.query;
    let whereClause = {};
    
    // Security: Customers only see their own reservations
    console.log(`Fetching reservations for UserID: ${req.user.userId}, Role: ${req.user.role}`);
    if (req.user.role === 'customer') {
      whereClause.CustomerID = req.user.userId;
      console.log('Applying CustomerID filter:', whereClause.CustomerID);
    }

    if (status) whereClause.Status = status;
    if (from && to) {
      whereClause.PickupDate = { [Op.between]: [from, to] };
    }

    const reservations = await Reservation.findAll({
      where: whereClause,
      include: [
        { 
          model: Customer, 
          include: [{ model: Person, attributes: ['FirstName', 'LastName', 'Phone'] }] 
        },
        Vehicle
      ],
      order: [['ReservationDate', 'DESC']]
    });
    console.log(`Found ${reservations.length} reservations for this user.`);
    res.json({ success: true, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reservations', error: error.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [
        { model: Customer, include: [Person] },
        Vehicle
      ]
    });
    if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
    res.json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reservation', error: error.message });
  }
};

exports.createReservation = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { vehicleId, customerId, pickupDate, returnDate, pickupTime, returnTime, specialRequests } = req.body;

    // Check vehicle availability
    const conflicting = await Reservation.findOne({
      where: {
        VehicleID: vehicleId,
        Status: { [Op.notIn]: ['Cancelled', 'Completed'] },
        [Op.or]: [
          { PickupDate: { [Op.between]: [pickupDate, returnDate] } },
          { ReturnDate: { [Op.between]: [pickupDate, returnDate] } },
          {
            PickupDate: { [Op.lte]: pickupDate },
            ReturnDate: { [Op.gte]: returnDate }
          }
        ]
      }
    });

    if (conflicting) {
      await t.rollback();
      return res.status(409).json({ success: false, message: 'Vehicle is not available for the selected dates' });
    }

    const reservation = await Reservation.create({
      VehicleID: vehicleId,
      CustomerID: customerId,
      PickupDate: pickupDate,
      ReturnDate: returnDate,
      PickupTime: pickupTime,
      ReturnTime: returnTime,
      SpecialRequests: specialRequests,
      Status: 'Pending'
    }, { transaction: t });

    // Set vehicle status to Reserved
    await Vehicle.update({ Status: 'Reserved' }, { where: { VehicleID: vehicleId }, transaction: t });

    await t.commit();
    res.status(201).json({ success: true, message: 'Reservation created', data: reservation });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create reservation', error: error.message });
  }
};

exports.updateReservationStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });

    await reservation.update({ Status: status }, { transaction: t });

    // If cancelled, reset vehicle to Available
    if (status === 'Cancelled') {
      await Vehicle.update({ Status: 'Available' }, { where: { VehicleID: reservation.VehicleID }, transaction: t });
    }

    await t.commit();
    res.json({ success: true, message: 'Reservation status updated', data: reservation });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to update reservation', error: error.message });
  }
};

exports.getAvailableVehicles = async (req, res) => {
  try {
    const { from, to, type } = req.query;
    if (!from || !to) return res.status(400).json({ success: false, message: 'From and To dates required' });

    // Find vehicles with conflicting reservations
    const conflictingIds = await Reservation.findAll({
      attributes: ['VehicleID'],
      where: {
        Status: { [Op.notIn]: ['Cancelled', 'Completed'] },
        [Op.or]: [
          { PickupDate: { [Op.between]: [from, to] } },
          { ReturnDate: { [Op.between]: [from, to] } },
          { PickupDate: { [Op.lte]: from }, ReturnDate: { [Op.gte]: to } }
        ]
      },
      raw: true
    });

    const conflictingVehicleIds = conflictingIds.map(r => r.VehicleID);

    let whereClause = {
      Status: 'Available',
      VehicleID: { [Op.notIn]: conflictingVehicleIds.length ? conflictingVehicleIds : [0] }
    };

    const vehicles = await Vehicle.findAll({ where: whereClause });
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch available vehicles', error: error.message });
  }
};
