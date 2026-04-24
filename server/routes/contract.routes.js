const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contract.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', verifyToken, requireRole('manager', 'clerk'), contractController.getContracts);
router.get('/:no', verifyToken, requireRole('manager', 'clerk'), contractController.getContractByNo);
router.post('/', verifyToken, requireRole('manager', 'clerk'), contractController.createContract);
router.put('/:no/close', verifyToken, requireRole('manager', 'clerk'), contractController.closeContract);
router.post('/:no/charges', verifyToken, requireRole('manager', 'clerk'), contractController.addCharge);

module.exports = router;
