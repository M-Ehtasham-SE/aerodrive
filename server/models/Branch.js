const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Branch = sequelize.define('Branch', {
  BranchID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  BranchName: { type: DataTypes.STRING(100), allowNull: false },
  Street: { type: DataTypes.STRING(100) },
  City: { type: DataTypes.STRING(50) },
  ZipCode: { type: DataTypes.STRING(20) },
  Phone: { type: DataTypes.STRING(20) }
}, { tableName: 'branch', timestamps: false });

module.exports = Branch;