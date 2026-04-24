const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Person = sequelize.define('Person', {
  PersonID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  FirstName: { type: DataTypes.STRING(50), allowNull: false },
  LastName: { type: DataTypes.STRING(50), allowNull: false },
  Street: { type: DataTypes.STRING(100) },
  City: { type: DataTypes.STRING(50) },
  ZipCode: { type: DataTypes.STRING(20) },
  Phone: { type: DataTypes.STRING(20), allowNull: false },
  AlternatePhone: { type: DataTypes.STRING(20) },
  Password: { type: DataTypes.STRING(255), allowNull: false },
}, { tableName: 'person', timestamps: true, createdAt: 'CreatedAt', updatedAt: false });

module.exports = Person;