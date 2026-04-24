const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Car = sequelize.define('Car', {
  VehicleID: { type: DataTypes.INTEGER, primaryKey: true },
  Doors: { type: DataTypes.INTEGER },
  TrunkCapacity: { type: DataTypes.DECIMAL(5, 2) },
  ACType: { type: DataTypes.STRING(50) },
  BootSpace: { type: DataTypes.DECIMAL(5, 2) }
}, { tableName: 'car', timestamps: false });

module.exports = Car;