const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/verifyToken');

router.post(
  '/register',
  [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('phone', 'Phone is required').notEmpty(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
    check('cnic', 'CNIC is required').notEmpty(),
    check('licenseNo', 'License Number is required').notEmpty(),
    check('dateOfBirth', 'Valid Date of Birth is required').isDate(),
  ],
  authController.register
);

router.post(
  '/login',
  [
    check('phone', 'Phone is required').notEmpty(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

router.get('/me', verifyToken, authController.me);

module.exports = router;
