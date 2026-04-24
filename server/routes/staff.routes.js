const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', verifyToken, requireRole('manager'), staffController.getStaff);
router.post('/', verifyToken, requireRole('manager'), staffController.createStaff);
router.put('/:id', verifyToken, requireRole('manager'), staffController.updateStaff);
router.delete('/:id', verifyToken, requireRole('manager'), staffController.deleteStaff);

module.exports = router;
