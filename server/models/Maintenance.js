const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Maintenance = sequelize.define('Maintenance', {
  MaintenanceID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ScheduledDate: { type: DataTypes.DATEONLY },
  CompletedDate: { type: DataTypes.DATEONLY },
  ServiceType: { type: DataTypes.STRING(100) },
  MileageAtService: { type: DataTypes.INTEGER },
  Description: { type: DataTypes.TEXT },
  Status: { type: DataTypes.ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled'), defaultValue: 'Scheduled' },
  LaborCost: { type: DataTypes.DECIMAL(10, 2) },
  PartsCost: { type: DataTypes.DECIMAL(10, 2) },
  TotalCost: { type: DataTypes.DECIMAL(10, 2) },
  VehicleID: { type: DataTypes.INTEGER },
  MechanicID: { type: DataTypes.INTEGER }
}, { tableName: 'maintenance', timestamps: false });

module.exports = Maintenance;