const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', vehicleController.getModels);
router.post('/', verifyToken, requireRole('manager'), vehicleController.createModel);

module.exports = router;
