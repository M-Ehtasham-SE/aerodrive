const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', verifyToken, requireRole('manager', 'clerk'), vehicleController.createVehicle);
router.put('/:id', verifyToken, requireRole('manager', 'clerk'), vehicleController.updateVehicle);
router.delete('/:id', verifyToken, requireRole('manager'), vehicleController.deleteVehicle);

module.exports = router;
