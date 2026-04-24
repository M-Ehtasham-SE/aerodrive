const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OnlinePayment = sequelize.define('OnlinePayment', {
  PaymentID: { type: DataTypes.INTEGER, primaryKey: true },
  PaymentGateway: { type: DataTypes.ENUM('Stripe', 'PayPal', 'JazzCash', 'Easypaisa') },
  TransactionReference: { type: DataTypes.STRING(100) },
  QRCode: { type: DataTypes.STRING(255) },
  WalletType: { type: DataTypes.ENUM('Mobile', 'Web') }
}, { tableName: 'online_payment', timestamps: false });

module.exports = OnlinePayment;