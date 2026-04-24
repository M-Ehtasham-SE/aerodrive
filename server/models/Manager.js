const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Manager = sequelize.define('Manager', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  Department: { type: DataTypes.STRING(100) },
  ManagedBranch: { type: DataTypes.STRING(100) },
  ReportsTo: { type: DataTypes.INTEGER },
  BonusPercentage: { type: DataTypes.DECIMAL(5, 2) }
}, { tableName: 'manager', timestamps: false });

module.exports = Manager;