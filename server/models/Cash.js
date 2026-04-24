const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cash = sequelize.define('Cash', {
  PaymentID: { type: DataTypes.INTEGER, primaryKey: true },
  CashierName: { type: DataTypes.STRING(100) },
  ReceiptNo: { type: DataTypes.STRING(50) },
  ChangeGiven: { type: DataTypes.DECIMAL(10, 2) }
}, { tableName: 'cash', timestamps: false });

module.exports = Cash;