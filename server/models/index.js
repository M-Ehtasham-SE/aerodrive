const sequelize = require('../config/db');
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
};