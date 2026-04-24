const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', verifyToken, requireRole('manager', 'clerk'), paymentController.getPayments);
router.get('/:id', verifyToken, requireRole('manager', 'clerk'), paymentController.getPaymentById);
router.post('/', verifyToken, requireRole('manager', 'clerk'), paymentController.createPayment);

module.exports = router;
