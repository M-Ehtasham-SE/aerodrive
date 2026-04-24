const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  PaymentID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  PaymentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  Amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  PaymentStatus: { type: DataTypes.ENUM('Paid', 'Pending', 'Failed'), defaultValue: 'Pending' },
  PaymentType: { type: DataTypes.ENUM('Cash', 'Card', 'Online'), allowNull: false },
  ReservationID: { type: DataTypes.INTEGER },
  ContractNo: { type: DataTypes.STRING(30) }
}, { tableName: 'payment', timestamps: false });

module.exports = Payment;