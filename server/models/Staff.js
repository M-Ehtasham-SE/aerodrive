const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Staff = sequelize.define('Staff', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  Position: { type: DataTypes.STRING(50) },
  HireDate: { type: DataTypes.DATEONLY },
  Salary: { type: DataTypes.DECIMAL(10, 2) },
  ShiftType: { type: DataTypes.ENUM('Morning', 'Evening', 'Night') },
  StartTime: { type: DataTypes.TIME },
  EndTime: { type: DataTypes.TIME },
  Qualifications: { type: DataTypes.TEXT },
  BranchID: { type: DataTypes.INTEGER }
}, { tableName: 'staff', timestamps: false });

module.exports = Staff;