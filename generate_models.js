const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'server', 'models');
if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir);

const models = {
  'Person.js': `const { DataTypes } = require('sequelize');
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

module.exports = Person;`,

  'Customer.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  CNIC: { type: DataTypes.STRING(15), unique: true, allowNull: false },
  LicenseNo: { type: DataTypes.STRING(30), unique: true, allowNull: false },
  DateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
  Occupation: { type: DataTypes.STRING(100) }
}, { tableName: 'customer', timestamps: false });

module.exports = Customer;`,

  'Staff.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Staff = sequelize.define('Staff', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  Position: { type: DataTypes.STRING(50) },
  HireDate: { type: DataTypes.DATEONLY },
  Salary: { type: DataTypes.DECIMAL(10, 2) },
  ShiftType: { type: DataTypes.ENUM('Morning', 'Evening', 'Night') },
  StartTime: { type: DataTypes.TIME },
  EndTime: { type: DataTypes.TIME },
  Qualifications: { type: DataTypes.TEXT },
  BranchID: { type: DataTypes.INTEGER }
}, { tableName: 'staff', timestamps: false });

module.exports = Staff;`,

  'Manager.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Manager = sequelize.define('Manager', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  Department: { type: DataTypes.STRING(100) },
  ManagedBranch: { type: DataTypes.STRING(100) },
  ReportsTo: { type: DataTypes.INTEGER },
  BonusPercentage: { type: DataTypes.DECIMAL(5, 2) }
}, { tableName: 'manager', timestamps: false });

module.exports = Manager;`,

  'Clerk.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Clerk = sequelize.define('Clerk', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  CounterNo: { type: DataTypes.INTEGER },
  DailyTransactions: { type: DataTypes.INTEGER, defaultValue: 0 },
  Supervisor: { type: DataTypes.STRING(100) },
  TerminalID: { type: DataTypes.STRING(50) }
}, { tableName: 'clerk', timestamps: false });

module.exports = Clerk;`,

  'Mechanic.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mechanic = sequelize.define('Mechanic', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  Specialization: { type: DataTypes.ENUM('Engine', 'Transmission', 'Electrical', 'General') },
  ToolKit: { type: DataTypes.STRING(200) },
  WorkshopAssigned: { type: DataTypes.STRING(100) }
}, { tableName: 'mechanic', timestamps: false });

module.exports = Mechanic;`,

  'EmergencyContact.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmergencyContact = sequelize.define('EmergencyContact', {
  PersonID: { type: DataTypes.INTEGER, primaryKey: true },
  Relationship: { type: DataTypes.STRING(50) },
  Priority: { type: DataTypes.INTEGER },
  CustomerID: { type: DataTypes.INTEGER }
}, { tableName: 'emergency_contact', timestamps: false });

module.exports = EmergencyContact;`,

  'Model.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Model = sequelize.define('Model', {
  ModelID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ModelName: { type: DataTypes.STRING(100), allowNull: false },
  Brand: { type: DataTypes.STRING(100), allowNull: false },
  Category: { type: DataTypes.STRING(50) },
  SeatingCapacity: { type: DataTypes.INTEGER },
  Transmission: { type: DataTypes.ENUM('Manual', 'Automatic', 'CVT') },
  FuelAverage: { type: DataTypes.DECIMAL(5, 2) },
  DailyRate: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'model', timestamps: false });

module.exports = Model;`,

  'Vehicle.js': `const { DataTypes } = require('sequelize');
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

module.exports = Vehicle;`,

  'Car.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Car = sequelize.define('Car', {
  VehicleID: { type: DataTypes.INTEGER, primaryKey: true },
  Doors: { type: DataTypes.INTEGER },
  TrunkCapacity: { type: DataTypes.DECIMAL(5, 2) },
  ACType: { type: DataTypes.STRING(50) },
  BootSpace: { type: DataTypes.DECIMAL(5, 2) }
}, { tableName: 'car', timestamps: false });

module.exports = Car;`,

  'Bike.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bike = sequelize.define('Bike', {
  VehicleID: { type: DataTypes.INTEGER, primaryKey: true },
  EngineCapacity: { type: DataTypes.INTEGER },
  BikeType: { type: DataTypes.ENUM('Sport', 'Cruiser', 'Standard') },
  HelmetIncluded: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'bike', timestamps: false });

module.exports = Bike;`,

  'Truck.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Truck = sequelize.define('Truck', {
  VehicleID: { type: DataTypes.INTEGER, primaryKey: true },
  LoadCapacity: { type: DataTypes.DECIMAL(8, 2) },
  Axles: { type: DataTypes.INTEGER },
  CargoType: { type: DataTypes.ENUM('Open', 'Closed', 'Refrigerated') },
  Height: { type: DataTypes.DECIMAL(5, 2) }
}, { tableName: 'truck', timestamps: false });

module.exports = Truck;`,

  'Branch.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Branch = sequelize.define('Branch', {
  BranchID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  BranchName: { type: DataTypes.STRING(100), allowNull: false },
  Street: { type: DataTypes.STRING(100) },
  City: { type: DataTypes.STRING(50) },
  ZipCode: { type: DataTypes.STRING(20) },
  Phone: { type: DataTypes.STRING(20) }
}, { tableName: 'branch', timestamps: false });

module.exports = Branch;`,

  'Reservation.js': `const { DataTypes } = require('sequelize');
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

module.exports = Reservation;`,

  'Contract.js': `const { DataTypes } = require('sequelize');
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

module.exports = Contract;`,

  'Payment.js': `const { DataTypes } = require('sequelize');
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

module.exports = Payment;`,

  'Cash.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cash = sequelize.define('Cash', {
  PaymentID: { type: DataTypes.INTEGER, primaryKey: true },
  CashierName: { type: DataTypes.STRING(100) },
  ReceiptNo: { type: DataTypes.STRING(50) },
  ChangeGiven: { type: DataTypes.DECIMAL(10, 2) }
}, { tableName: 'cash', timestamps: false });

module.exports = Cash;`,

  'Card.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Card = sequelize.define('Card', {
  PaymentID: { type: DataTypes.INTEGER, primaryKey: true },
  CardType: { type: DataTypes.ENUM('Visa', 'Mastercard', 'Amex', 'Discover') },
  CardLast4: { type: DataTypes.STRING(4) },
  TransactionID: { type: DataTypes.STRING(100) },
  AuthorizationCode: { type: DataTypes.STRING(100) }
}, { tableName: 'card', timestamps: false });

module.exports = Card;`,

  'OnlinePayment.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OnlinePayment = sequelize.define('OnlinePayment', {
  PaymentID: { type: DataTypes.INTEGER, primaryKey: true },
  PaymentGateway: { type: DataTypes.ENUM('Stripe', 'PayPal', 'JazzCash', 'Easypaisa') },
  TransactionReference: { type: DataTypes.STRING(100) },
  QRCode: { type: DataTypes.STRING(255) },
  WalletType: { type: DataTypes.ENUM('Mobile', 'Web') }
}, { tableName: 'online_payment', timestamps: false });

module.exports = OnlinePayment;`,

  'DamageReport.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DamageReport = sequelize.define('DamageReport', {
  ReportID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ReportDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  DamagePart: { type: DataTypes.STRING(100) },
  DamageSide: { type: DataTypes.STRING(50) },
  Severity: { type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical') },
  IncidentDetails: { type: DataTypes.TEXT },
  Description: { type: DataTypes.TEXT },
  Status: { type: DataTypes.ENUM('Pending', 'In Review', 'Resolved'), defaultValue: 'Pending' },
  RepairCost: { type: DataTypes.DECIMAL(10, 2) },
  InsuranceClaim: { type: DataTypes.BOOLEAN, defaultValue: false },
  VehicleID: { type: DataTypes.INTEGER },
  ContractNo: { type: DataTypes.STRING(30) }
}, { tableName: 'damage_report', timestamps: false });

module.exports = DamageReport;`,

  'Maintenance.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Maintenance = sequelize.define('Maintenance', {
  MaintenanceID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ScheduledDate: { type: DataTypes.DATEONLY },
  CompletedDate: { type: DataTypes.DATEONLY },
  ServiceType: { type: DataTypes.STRING(100) },
  MileageAtService: { type: DataTypes.INTEGER },
  Description: { type: DataTypes.TEXT },
  Status: { type: DataTypes.ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled'), defaultValue: 'Scheduled' },
  LaborCost: { type: DataTypes.DECIMAL(10, 2) },
  PartsCost: { type: DataTypes.DECIMAL(10, 2) },
  TotalCost: { type: DataTypes.DECIMAL(10, 2) },
  VehicleID: { type: DataTypes.INTEGER },
  MechanicID: { type: DataTypes.INTEGER }
}, { tableName: 'maintenance', timestamps: false });

module.exports = Maintenance;`,

  'Insurance.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Insurance = sequelize.define('Insurance', {
  PolicyNo: { type: DataTypes.STRING(50), primaryKey: true },
  InsuranceCompany: { type: DataTypes.STRING(100) },
  StartDate: { type: DataTypes.DATEONLY },
  EndDate: { type: DataTypes.DATEONLY },
  CoverageType: { type: DataTypes.STRING(100) },
  MaxCoverage: { type: DataTypes.DECIMAL(12, 2) },
  Status: { type: DataTypes.ENUM('Active', 'Expired', 'Cancelled'), defaultValue: 'Active' },
  VehicleID: { type: DataTypes.INTEGER }
}, { tableName: 'insurance', timestamps: false });

module.exports = Insurance;`,

  // Multivalued Attribute Models
  'Multivalued.js': `const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const createMultivaluedModel = (modelName, tableName, fkField, valueField, valueType) => {
  return sequelize.define(modelName, {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    [fkField]: { type: DataTypes.INTEGER }, // String for ContractNo and PolicyNo will be overridden below if needed
    [valueField]: valueType
  }, { tableName, timestamps: false });
};

const CustomerEmail = createMultivaluedModel('CustomerEmail', 'customer_email', 'PersonID', 'Email', { type: DataTypes.STRING(100) });
const CustomerPaymentMethod = createMultivaluedModel('CustomerPaymentMethod', 'customer_payment_method', 'PersonID', 'PaymentMethod', { type: DataTypes.STRING(50) });
const StaffEmail = createMultivaluedModel('StaffEmail', 'staff_email', 'PersonID', 'Email', { type: DataTypes.STRING(100) });
const StaffSkill = createMultivaluedModel('StaffSkill', 'staff_skill', 'PersonID', 'Skill', { type: DataTypes.STRING(100) });
const StaffCertification = createMultivaluedModel('StaffCertification', 'staff_certification', 'PersonID', 'Certification', { type: DataTypes.STRING(100) });
const MechanicCertification = createMultivaluedModel('MechanicCertification', 'mechanic_certification', 'PersonID', 'Certification', { type: DataTypes.STRING(100) });
const BranchEmail = createMultivaluedModel('BranchEmail', 'branch_email', 'BranchID', 'Email', { type: DataTypes.STRING(100) });
const BranchSocial = sequelize.define('BranchSocial', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  BranchID: { type: DataTypes.INTEGER },
  Platform: { type: DataTypes.STRING(50) },
  Handle: { type: DataTypes.STRING(100) }
}, { tableName: 'branch_social', timestamps: false });
const ModelColor = createMultivaluedModel('ModelColor', 'model_color', 'ModelID', 'Color', { type: DataTypes.STRING(50) });
const ModelFeature = createMultivaluedModel('ModelFeature', 'model_feature', 'ModelID', 'Feature', { type: DataTypes.STRING(100) });
const InsurancePeril = sequelize.define('InsurancePeril', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  PolicyNo: { type: DataTypes.STRING(50) },
  Peril: { type: DataTypes.STRING(100) }
}, { tableName: 'insurance_peril', timestamps: false });
const InsuranceExclusion = sequelize.define('InsuranceExclusion', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  PolicyNo: { type: DataTypes.STRING(50) },
  Exclusion: { type: DataTypes.STRING(100) }
}, { tableName: 'insurance_exclusion', timestamps: false });
const DamagePhoto = sequelize.define('DamagePhoto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ReportID: { type: DataTypes.INTEGER },
  PhotoURL: { type: DataTypes.STRING(255) }
}, { tableName: 'damage_photo', timestamps: false });
const ContractCharge = sequelize.define('ContractCharge', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ContractNo: { type: DataTypes.STRING(30) },
  ChargeDescription: { type: DataTypes.STRING(100) },
  Amount: { type: DataTypes.DECIMAL(10, 2) }
}, { tableName: 'contract_charge', timestamps: false });
const MaintenancePart = sequelize.define('MaintenancePart', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  MaintenanceID: { type: DataTypes.INTEGER },
  PartName: { type: DataTypes.STRING(100) },
  PartCost: { type: DataTypes.DECIMAL(10, 2) },
  Quantity: { type: DataTypes.INTEGER }
}, { tableName: 'maintenance_part', timestamps: false });

module.exports = {
  CustomerEmail, CustomerPaymentMethod, StaffEmail, StaffSkill, StaffCertification, MechanicCertification,
  BranchEmail, BranchSocial, ModelColor, ModelFeature, InsurancePeril, InsuranceExclusion, DamagePhoto, ContractCharge, MaintenancePart
};`,

  'index.js': `const sequelize = require('../config/db');
const Person = require('./Person');
const Customer = require('./Customer');
const Staff = require('./Staff');
const Manager = require('./Manager');
const Clerk = require('./Clerk');
const Mechanic = require('./Mechanic');
const EmergencyContact = require('./EmergencyContact');
const Branch = require('./Branch');
const Model = require('./Model');
const Vehicle = require('./Vehicle');
const Car = require('./Car');
const Bike = require('./Bike');
const Truck = require('./Truck');
const Reservation = require('./Reservation');
const Contract = require('./Contract');
const Payment = require('./Payment');
const Cash = require('./Cash');
const Card = require('./Card');
const OnlinePayment = require('./OnlinePayment');
const DamageReport = require('./DamageReport');
const Maintenance = require('./Maintenance');
const Insurance = require('./Insurance');
const {
  CustomerEmail, CustomerPaymentMethod, StaffEmail, StaffSkill, StaffCertification, MechanicCertification,
  BranchEmail, BranchSocial, ModelColor, ModelFeature, InsurancePeril, InsuranceExclusion, DamagePhoto, ContractCharge, MaintenancePart
} = require('./Multivalued');

// Person Hierarchy
Person.hasOne(Customer, { foreignKey: 'PersonID', onDelete: 'CASCADE' });
Customer.belongsTo(Person, { foreignKey: 'PersonID' });

Person.hasOne(Staff, { foreignKey: 'PersonID', onDelete: 'CASCADE' });
Staff.belongsTo(Person, { foreignKey: 'PersonID' });

Staff.hasOne(Manager, { foreignKey: 'PersonID' });
Manager.belongsTo(Staff, { foreignKey: 'PersonID' });

Staff.hasOne(Clerk, { foreignKey: 'PersonID' });
Clerk.belongsTo(Staff, { foreignKey: 'PersonID' });

Staff.hasOne(Mechanic, { foreignKey: 'PersonID' });
Mechanic.belongsTo(Staff, { foreignKey: 'PersonID' });

Person.hasMany(EmergencyContact, { foreignKey: 'PersonID', onDelete: 'CASCADE' });
EmergencyContact.belongsTo(Person, { foreignKey: 'PersonID' });
Customer.hasMany(EmergencyContact, { foreignKey: 'CustomerID', onDelete: 'CASCADE' });
EmergencyContact.belongsTo(Customer, { foreignKey: 'CustomerID' });

Branch.hasMany(Staff, { foreignKey: 'BranchID' });
Staff.belongsTo(Branch, { foreignKey: 'BranchID' });

// Vehicle Hierarchy
Model.hasMany(Vehicle, { foreignKey: 'ModelID' });
Vehicle.belongsTo(Model, { foreignKey: 'ModelID' });

Branch.hasMany(Vehicle, { foreignKey: 'BranchID' });
Vehicle.belongsTo(Branch, { foreignKey: 'BranchID' });

Vehicle.hasOne(Car, { foreignKey: 'VehicleID', onDelete: 'CASCADE' });
Car.belongsTo(Vehicle, { foreignKey: 'VehicleID' });

Vehicle.hasOne(Bike, { foreignKey: 'VehicleID', onDelete: 'CASCADE' });
Bike.belongsTo(Vehicle, { foreignKey: 'VehicleID' });

Vehicle.hasOne(Truck, { foreignKey: 'VehicleID', onDelete: 'CASCADE' });
Truck.belongsTo(Vehicle, { foreignKey: 'VehicleID' });

// Operations
Customer.hasMany(Reservation, { foreignKey: 'CustomerID' });
Reservation.belongsTo(Customer, { foreignKey: 'CustomerID' });

Vehicle.hasMany(Reservation, { foreignKey: 'VehicleID' });
Reservation.belongsTo(Vehicle, { foreignKey: 'VehicleID' });

Reservation.hasOne(Contract, { foreignKey: 'ReservationID' });
Contract.belongsTo(Reservation, { foreignKey: 'ReservationID' });

Customer.hasMany(Contract, { foreignKey: 'CustomerID' });
Contract.belongsTo(Customer, { foreignKey: 'CustomerID' });

Vehicle.hasMany(Contract, { foreignKey: 'VehicleID' });
Contract.belongsTo(Vehicle, { foreignKey: 'VehicleID' });

Reservation.hasMany(Payment, { foreignKey: 'ReservationID' });
Payment.belongsTo(Reservation, { foreignKey: 'ReservationID' });

Contract.hasMany(Payment, { foreignKey: 'ContractNo', sourceKey: 'ContractNo' });
Payment.belongsTo(Contract, { foreignKey: 'ContractNo', targetKey: 'ContractNo' });

Payment.hasOne(Cash, { foreignKey: 'PaymentID', onDelete: 'CASCADE' });
Cash.belongsTo(Payment, { foreignKey: 'PaymentID' });

Payment.hasOne(Card, { foreignKey: 'PaymentID', onDelete: 'CASCADE' });
Card.belongsTo(Payment, { foreignKey: 'PaymentID' });

Payment.hasOne(OnlinePayment, { foreignKey: 'PaymentID', onDelete: 'CASCADE' });
OnlinePayment.belongsTo(Payment, { foreignKey: 'PaymentID' });

Vehicle.hasMany(DamageReport, { foreignKey: 'VehicleID' });
DamageReport.belongsTo(Vehicle, { foreignKey: 'VehicleID' });

Contract.hasMany(DamageReport, { foreignKey: 'ContractNo', sourceKey: 'ContractNo' });
DamageReport.belongsTo(Contract, { foreignKey: 'ContractNo', targetKey: 'ContractNo' });

Vehicle.hasMany(Maintenance, { foreignKey: 'VehicleID' });
Maintenance.belongsTo(Vehicle, { foreignKey: 'VehicleID' });

Mechanic.hasMany(Maintenance, { foreignKey: 'MechanicID', sourceKey: 'PersonID' });
Maintenance.belongsTo(Mechanic, { foreignKey: 'MechanicID', targetKey: 'PersonID' });

Vehicle.hasMany(Insurance, { foreignKey: 'VehicleID' });
Insurance.belongsTo(Vehicle, { foreignKey: 'VehicleID' });

// Multivalued attributes
Customer.hasMany(CustomerEmail, { foreignKey: 'PersonID', onDelete: 'CASCADE' });
Customer.hasMany(CustomerPaymentMethod, { foreignKey: 'PersonID', onDelete: 'CASCADE' });
Staff.hasMany(StaffEmail, { foreignKey: 'PersonID', onDelete: 'CASCADE' });
Staff.hasMany(StaffSkill, { foreignKey: 'PersonID', onDelete: 'CASCADE' });
Staff.hasMany(StaffCertification, { foreignKey: 'PersonID', onDelete: 'CASCADE' });
Mechanic.hasMany(MechanicCertification, { foreignKey: 'PersonID', onDelete: 'CASCADE', sourceKey: 'PersonID' });
Branch.hasMany(BranchEmail, { foreignKey: 'BranchID', onDelete: 'CASCADE' });
Branch.hasMany(BranchSocial, { foreignKey: 'BranchID', onDelete: 'CASCADE' });
Model.hasMany(ModelColor, { foreignKey: 'ModelID', onDelete: 'CASCADE' });
Model.hasMany(ModelFeature, { foreignKey: 'ModelID', onDelete: 'CASCADE' });
Insurance.hasMany(InsurancePeril, { foreignKey: 'PolicyNo', onDelete: 'CASCADE', sourceKey: 'PolicyNo' });
Insurance.hasMany(InsuranceExclusion, { foreignKey: 'PolicyNo', onDelete: 'CASCADE', sourceKey: 'PolicyNo' });
DamageReport.hasMany(DamagePhoto, { foreignKey: 'ReportID', onDelete: 'CASCADE' });
Contract.hasMany(ContractCharge, { foreignKey: 'ContractNo', onDelete: 'CASCADE', sourceKey: 'ContractNo' });
Maintenance.hasMany(MaintenancePart, { foreignKey: 'MaintenanceID', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  Person, Customer, Staff, Manager, Clerk, Mechanic, EmergencyContact,
  Branch, Model, Vehicle, Car, Bike, Truck,
  Reservation, Contract, Payment, Cash, Card, OnlinePayment,
  DamageReport, Maintenance, Insurance,
  CustomerEmail, CustomerPaymentMethod, StaffEmail, StaffSkill, StaffCertification, MechanicCertification,
  BranchEmail, BranchSocial, ModelColor, ModelFeature, InsurancePeril, InsuranceExclusion, DamagePhoto, ContractCharge, MaintenancePart
};`
};

for (const [filename, content] of Object.entries(models)) {
  fs.writeFileSync(path.join(modelsDir, filename), content);
}

console.log('Successfully created all model files.');
