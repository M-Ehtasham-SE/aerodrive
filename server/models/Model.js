const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Model = sequelize.define('Model', {
  ModelID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ModelName: { type: DataTypes.STRING(100), allowNull: false },
  Brand: { type: DataTypes.STRING(100), allowNull: false },
  Category: { type: DataTypes.STRING(50) },
  SeatingCapacity: { type: DataTypes.INTEGER },
  Transmission: { type: DataTypes.ENUM('Manual', 'Automatic', 'CVT') },
  FuelAverage: { type: DataTypes.DECIMAL(5, 2) },
  DailyRate: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'model', timestamps: false });

module.exports = Model;