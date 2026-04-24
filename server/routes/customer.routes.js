const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', verifyToken, requireRole('manager', 'clerk'), customerController.getCustomers);
router.get('/:id', verifyToken, customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', verifyToken, customerController.updateCustomer);
router.get('/:id/reservations', verifyToken, customerController.getCustomerReservations);

module.exports = router;
