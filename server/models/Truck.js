const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Truck = sequelize.define('Truck', {
  VehicleID: { type: DataTypes.INTEGER, primaryKey: true },
  LoadCapacity: { type: DataTypes.DECIMAL(8, 2) },
  Axles: { type: DataTypes.INTEGER },
  CargoType: { type: DataTypes.ENUM('Open', 'Closed', 'Refrigerated') },
  Height: { type: DataTypes.DECIMAL(5, 2) }
}, { tableName: 'truck', timestamps: false });

module.exports = Truck;