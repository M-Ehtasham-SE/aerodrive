const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', verifyToken, requireRole('manager', 'mechanic'), maintenanceController.getMaintenance);
router.post('/', verifyToken, requireRole('manager', 'mechanic'), maintenanceController.createMaintenance);
router.put('/:id', verifyToken, requireRole('manager', 'mechanic'), maintenanceController.updateMaintenance);
router.put('/:id/complete', verifyToken, requireRole('manager', 'mechanic'), maintenanceController.completeMaintenance);
router.post('/:id/parts', verifyToken, requireRole('manager', 'mechanic'), maintenanceController.addPart);

module.exports = router;
