const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insurance.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', verifyToken, requireRole('manager'), insuranceController.getInsurance);
router.get('/:no', verifyToken, requireRole('manager'), insuranceController.getInsuranceByNo);
router.post('/', verifyToken, requireRole('manager'), insuranceController.createInsurance);
router.put('/:no', verifyToken, requireRole('manager'), insuranceController.updateInsurance);

module.exports = router;
