const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Clerk = sequelize.define('Clerk', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  CounterNo: { type: DataTypes.INTEGER },
  DailyTransactions: { type: DataTypes.INTEGER, defaultValue: 0 },
  Supervisor: { type: DataTypes.STRING(100) },
  TerminalID: { type: DataTypes.STRING(50) }
}, { tableName: 'clerk', timestamps: false });

module.exports = Clerk;