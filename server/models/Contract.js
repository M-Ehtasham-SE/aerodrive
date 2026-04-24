const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contract = sequelize.define('Contract', {
  ContractNo: { type: DataTypes.STRING(30), primaryKey: true },
  PickupDate: { type: DataTypes.DATEONLY },
  ReturnDate: { type: DataTypes.DATEONLY },
  BaseCharge: { type: DataTypes.DECIMAL(10, 2) },
  TotalCharge: { type: DataTypes.DECIMAL(10, 2) },
  PaymentStatus: { type: DataTypes.ENUM('Pending', 'Partial', 'Paid') },
  MileageAtStart: { type: DataTypes.INTEGER },
  MileageAtEnd: { type: DataTypes.INTEGER },
  TermsAndConditions: { type: DataTypes.TEXT },
  ReservationID: { type: DataTypes.INTEGER, unique: true },
  CustomerID: { type: DataTypes.INTEGER },
  VehicleID: { type: DataTypes.INTEGER }
}, { tableName: 'contract', timestamps: false });

module.exports = Contract;