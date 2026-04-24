const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reservation = sequelize.define('Reservation', {
  ReservationID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ReservationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  PickupDate: { type: DataTypes.DATEONLY, allowNull: false },
  PickupTime: { type: DataTypes.TIME },
  ReturnDate: { type: DataTypes.DATEONLY, allowNull: false },
  ReturnTime: { type: DataTypes.TIME },
  Status: { type: DataTypes.ENUM('Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'), defaultValue: 'Pending' },
  SpecialRequests: { type: DataTypes.TEXT },
  CustomerID: { type: DataTypes.INTEGER, allowNull: false },
  VehicleID: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'reservation', timestamps: false });

module.exports = Reservation;