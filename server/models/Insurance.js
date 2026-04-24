const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Insurance = sequelize.define('Insurance', {
  PolicyNo: { type: DataTypes.STRING(50), primaryKey: true },
  InsuranceCompany: { type: DataTypes.STRING(100) },
  StartDate: { type: DataTypes.DATEONLY },
  EndDate: { type: DataTypes.DATEONLY },
  CoverageType: { type: DataTypes.STRING(100) },
  MaxCoverage: { type: DataTypes.DECIMAL(12, 2) },
  Status: { type: DataTypes.ENUM('Active', 'Expired', 'Cancelled'), defaultValue: 'Active' },
  VehicleID: { type: DataTypes.INTEGER }
}, { tableName: 'insurance', timestamps: false });

module.exports = Insurance;