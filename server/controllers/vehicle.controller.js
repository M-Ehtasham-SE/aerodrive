const { Vehicle, Car, Bike, Truck, Model, ModelColor, ModelFeature, Branch, sequelize } = require('../models');

exports.getVehicles = async (req, res) => {
  try {
    const { type, status, branchId } = req.query;
    
    let whereClause = {};
    if (status) whereClause.Status = status;
    if (branchId) whereClause.BranchID = branchId;

    let includeClause = [
      { model: Model, include: [ModelColor, ModelFeature] },
      { model: Branch }
    ];

    if (type) {
      if (type === 'car') includeClause.push({ model: Car, required: true });
      if (type === 'bike') includeClause.push({ model: Bike, required: true });
      if (type === 'truck') includeClause.push({ model: Truck, required: true });
    } else {
      includeClause.push(Car, Bike, Truck);
    }

    const vehicles = await Vehicle.findAll({
      where: whereClause,
      include: includeClause
    });

    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch vehicles', error: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id, {
      include: [
        { model: Model, include: [ModelColor, ModelFeature] },
        Branch, Car, Bike, Truck
      ]
    });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch vehicle', error: error.message });
  }
};

exports.createVehicle = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { type, subclassData, ...vehicleData } = req.body;
    
    const vehicle = await Vehicle.create(vehicleData, { transaction: t });

    if (type === 'car') {
      await Car.create({ VehicleID: vehicle.VehicleID, ...subclassData }, { transaction: t });
    } else if (type === 'bike') {
      await Bike.create({ VehicleID: vehicle.VehicleID, ...subclassData }, { transaction: t });
    } else if (type === 'truck') {
      await Truck.create({ VehicleID: vehicle.VehicleID, ...subclassData }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Vehicle created', data: vehicle });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create vehicle', error: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { type, subclassData, ...vehicleData } = req.body;
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    await vehicle.update(vehicleData, { transaction: t });

    if (type === 'car') {
      await Car.update(subclassData, { where: { VehicleID: vehicle.VehicleID }, transaction: t });
    } else if (type === 'bike') {
      await Bike.update(subclassData, { where: { VehicleID: vehicle.VehicleID }, transaction: t });
    } else if (type === 'truck') {
      await Truck.update(subclassData, { where: { VehicleID: vehicle.VehicleID }, transaction: t });
    }

    await t.commit();
    res.json({ success: true, message: 'Vehicle updated', data: vehicle });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to update vehicle', error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    
    await vehicle.update({ Status: 'Retired' });
    res.json({ success: true, message: 'Vehicle retired' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete vehicle', error: error.message });
  }
};

// Models endpoints
exports.getModels = async (req, res) => {
  try {
    const models = await Model.findAll({ include: [ModelColor, ModelFeature] });
    res.json({ success: true, data: models });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch models', error: error.message });
  }
};

exports.createModel = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { colors, features, ...modelData } = req.body;
    const model = await Model.create(modelData, { transaction: t });

    if (colors && colors.length) {
      await ModelColor.bulkCreate(colors.map(c => ({ ModelID: model.ModelID, Color: c })), { transaction: t });
    }
    if (features && features.length) {
      await ModelFeature.bulkCreate(features.map(f => ({ ModelID: model.ModelID, Feature: f })), { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Model created', data: model });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create model', error: error.message });
  }
};
