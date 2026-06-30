const express = require('express');
const router = express.Router();
const damageController = require('../controllers/damage.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

// Ensure uploads directory exists (skipped on read-only filesystems like Vercel)
const fs = require('fs');
const path = require('path');
try {
  const uploadDir = path.join(__dirname, '../uploads/damage-photos');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
} catch (e) { /* read-only filesystem, skip */ }

router.get('/', verifyToken, requireRole('manager', 'clerk'), damageController.getDamageReports);
router.get('/:id', verifyToken, requireRole('manager', 'clerk'), damageController.getDamageReportById);
router.post('/', verifyToken, requireRole('manager', 'clerk'), damageController.upload.array('photos', 10), damageController.createDamageReport);
router.put('/:id/status', verifyToken, requireRole('manager'), damageController.updateDamageStatus);

module.exports = router;
