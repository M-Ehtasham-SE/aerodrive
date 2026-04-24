const { DamageReport, DamagePhoto, Vehicle, Contract, sequelize } = require('../models');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/damage-photos'),
  filename: (req, file, cb) => cb(null, `damage-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Images only')) });

exports.upload = upload;

exports.getDamageReports = async (req, res) => {
  try {
    const { vehicleId, status } = req.query;
    let whereClause = {};
    if (vehicleId) whereClause.VehicleID = vehicleId;
    if (status) whereClause.Status = status;
    const reports = await DamageReport.findAll({ where: whereClause, include: [Vehicle, DamagePhoto] });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch damage reports', error: error.message });
  }
};

exports.createDamageReport = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { vehicleId, contractNo, damagePart, damageSide, severity, incidentDetails, description, repairCost, insuranceClaim } = req.body;
    const report = await DamageReport.create({
      VehicleID: vehicleId, ContractNo: contractNo, DamagePart: damagePart, DamageSide: damageSide,
      Severity: severity, IncidentDetails: incidentDetails, Description: description,
      RepairCost: repairCost, InsuranceClaim: insuranceClaim === 'true'
    }, { transaction: t });

    if (req.files && req.files.length > 0) {
      const photos = req.files.map(f => ({ ReportID: report.ReportID, PhotoURL: `/uploads/damage-photos/${f.filename}` }));
      await DamagePhoto.bulkCreate(photos, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Damage report created', data: report });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create damage report', error: error.message });
  }
};

exports.updateDamageStatus = async (req, res) => {
  try {
    const report = await DamageReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    await report.update({ Status: req.body.status });
    res.json({ success: true, message: 'Status updated', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: error.message });
  }
};

exports.getDamageReportById = async (req, res) => {
  try {
    const report = await DamageReport.findByPk(req.params.id, { include: [Vehicle, DamagePhoto] });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch report', error: error.message });
  }
};
