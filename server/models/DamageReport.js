const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DamageReport = sequelize.define('DamageReport', {
  ReportID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ReportDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  DamagePart: { type: DataTypes.STRING(100) },
  DamageSide: { type: DataTypes.STRING(50) },
  Severity: { type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical') },
  IncidentDetails: { type: DataTypes.TEXT },
  Description: { type: DataTypes.TEXT },
  Status: { type: DataTypes.ENUM('Pending', 'In Review', 'Resolved'), defaultValue: 'Pending' },
  RepairCost: { type: DataTypes.DECIMAL(10, 2) },
  InsuranceClaim: { type: DataTypes.BOOLEAN, defaultValue: false },
  VehicleID: { type: DataTypes.INTEGER },
  ContractNo: { type: DataTypes.STRING(30) }
}, { tableName: 'damage_report', timestamps: false });

module.exports = DamageReport;