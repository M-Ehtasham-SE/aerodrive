const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/summary', verifyToken, requireRole('manager'), dashboardController.getSummary);
router.get('/utilisation', verifyToken, requireRole('manager'), dashboardController.getUtilisation);
router.get('/alerts', verifyToken, requireRole('manager'), dashboardController.getAlerts);
router.get('/revenue', verifyToken, requireRole('manager'), dashboardController.getRevenue);

module.exports = router;
