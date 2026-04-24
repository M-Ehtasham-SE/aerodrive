const { DataTypes } = require('sequelize');
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
};