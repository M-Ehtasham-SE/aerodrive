const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mechanic = sequelize.define('Mechanic', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  Specialization: { type: DataTypes.ENUM('Engine', 'Transmission', 'Electrical', 'General') },
  ToolKit: { type: DataTypes.STRING(200) },
  WorkshopAssigned: { type: DataTypes.STRING(100) }
}, { tableName: 'mechanic', timestamps: false });

module.exports = Mechanic;