const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', verifyToken, branchController.getBranches);
router.post('/', verifyToken, requireRole('manager'), branchController.createBranch);

module.exports = router;
