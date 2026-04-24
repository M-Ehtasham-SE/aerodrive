const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmergencyContact = sequelize.define('EmergencyContact', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  Relationship: { type: DataTypes.STRING(50) },
  Priority: { type: DataTypes.INTEGER },
  CustomerID: { type: DataTypes.INTEGER }
}, { tableName: 'emergency_contact', timestamps: false });

module.exports = EmergencyContact;