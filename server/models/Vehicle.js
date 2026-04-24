const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vehicle = sequelize.define('Vehicle', {
  VehicleID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  RegistrationNo: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  LicensePlate: { type: DataTypes.STRING(30), unique: true, allowNull: false },
  Mileage: { type: DataTypes.INTEGER, defaultValue: 0 },
  Status: { type: DataTypes.ENUM('Available', 'Rented', 'Maintenance', 'Reserved', 'Retired'), defaultValue: 'Available' },
  FuelType: { type: DataTypes.ENUM('Petrol', 'Diesel', 'Electric', 'Hybrid') },
  Year: { type: DataTypes.INTEGER },
  Color: { type: DataTypes.STRING(30) },
  CurrentCity: { type: DataTypes.STRING(50) },
  ParkingSpot: { type: DataTypes.STRING(50) },
  ModelID: { type: DataTypes.INTEGER, allowNull: false },
  BranchID: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'vehicle', timestamps: false });

module.exports = Vehicle;