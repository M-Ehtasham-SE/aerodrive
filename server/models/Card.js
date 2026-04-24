const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Card = sequelize.define('Card', {
  PaymentID: { type: DataTypes.INTEGER, primaryKey: true },
  CardType: { type: DataTypes.ENUM('Visa', 'Mastercard', 'Amex', 'Discover') },
  CardLast4: { type: DataTypes.STRING(4) },
  TransactionID: { type: DataTypes.STRING(100) },
  AuthorizationCode: { type: DataTypes.STRING(100) }
}, { tableName: 'card', timestamps: false });

module.exports = Card;