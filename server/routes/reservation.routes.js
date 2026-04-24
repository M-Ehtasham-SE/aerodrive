const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

router.get('/', verifyToken, requireRole('manager', 'clerk'), reservationController.getReservations);
router.get('/available', reservationController.getAvailableVehicles);
router.get('/:id', verifyToken, reservationController.getReservationById);
router.post('/', verifyToken, reservationController.createReservation);
router.put('/:id/status', verifyToken, requireRole('manager', 'clerk'), reservationController.updateReservationStatus);

module.exports = router;
