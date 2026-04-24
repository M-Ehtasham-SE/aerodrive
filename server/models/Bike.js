const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bike = sequelize.define('Bike', {
  VehicleID: { type: DataTypes.INTEGER, primaryKey: true },
  EngineCapacity: { type: DataTypes.INTEGER },
  BikeType: { type: DataTypes.ENUM('Sport', 'Cruiser', 'Standard') },
  HelmetIncluded: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'bike', timestamps: false });

module.exports = Bike;