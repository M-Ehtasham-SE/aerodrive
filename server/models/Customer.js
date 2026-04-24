const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  CNIC: { type: DataTypes.STRING(15), unique: true, allowNull: false },
  LicenseNo: { type: DataTypes.STRING(30), unique: true, allowNull: false },
  DateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
  Occupation: { type: DataTypes.STRING(100) }
}, { tableName: 'customer', timestamps: false });

module.exports = Customer;