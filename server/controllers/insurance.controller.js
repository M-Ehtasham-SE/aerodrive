const { Insurance, InsurancePeril, InsuranceExclusion, Vehicle, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getInsurance = async (req, res) => {
  try {
    const { vehicleId, status } = req.query;
    let whereClause = {};
    if (vehicleId) whereClause.VehicleID = vehicleId;
    if (status) whereClause.Status = status;
    const policies = await Insurance.findAll({
      where: whereClause,
      include: [Vehicle, InsurancePeril, InsuranceExclusion]
    });
    res.json({ success: true, data: policies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch insurance', error: error.message });
  }
};

exports.createInsurance = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { perils, exclusions, ...insData } = req.body;
    const policy = await Insurance.create(insData, { transaction: t });
    if (perils?.length) await InsurancePeril.bulkCreate(perils.map(p => ({ PolicyNo: policy.PolicyNo, Peril: p })), { transaction: t });
    if (exclusions?.length) await InsuranceExclusion.bulkCreate(exclusions.map(e => ({ PolicyNo: policy.PolicyNo, Exclusion: e })), { transaction: t });
    await t.commit();
    res.status(201).json({ success: true, message: 'Insurance policy created', data: policy });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create insurance', error: error.message });
  }
};

exports.updateInsurance = async (req, res) => {
  try {
    const policy = await Insurance.findByPk(req.params.no);
    if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });
    await policy.update(req.body);
    res.json({ success: true, message: 'Insurance updated', data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update insurance', error: error.message });
  }
};

exports.getInsuranceByNo = async (req, res) => {
  try {
    const policy = await Insurance.findByPk(req.params.no, { include: [Vehicle, InsurancePeril, InsuranceExclusion] });
    if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });
    res.json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch insurance', error: error.message });
  }
};
