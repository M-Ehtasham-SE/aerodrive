const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Person, Customer, Staff, Manager } = require('../models');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { firstName, lastName, phone, password, cnic, licenseNo, dateOfBirth, occupation } = req.body;

  try {
    const existingPerson = await Person.findOne({ where: { Phone: phone } });
    if (existingPerson) return res.status(400).json({ success: false, message: 'Phone number already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const person = await Person.create({
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
      Password: hashedPassword
    });

    const customer = await Customer.create({
      PersonID: person.PersonID,
      CNIC: cnic,
      LicenseNo: licenseNo,
      DateOfBirth: dateOfBirth,
      Occupation: occupation
    });

    res.status(201).json({ success: true, message: 'Customer registered successfully', data: { person, customer } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  let { phone, password } = req.body;
  // Basic normalization: remove spaces/hyphens if user types them differently
  // However, the seed data HAS hyphens. So we should ensure consistency.
  // For now, let's just use what's sent.
  try {
    const person = await Person.findOne({ where: { Phone: phone } });
    if (!person) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, person.Password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    // Determine role
    let role = 'customer';
    const staff = await Staff.findOne({ where: { PersonID: person.PersonID } });
    if (staff) {
      role = staff.Position.toLowerCase(); // 'manager', 'clerk', 'mechanic'
    }

    const payload = {
      userId: person.PersonID,
      role: role,
      name: `${person.FirstName} ${person.LastName}`
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    res.json({ success: true, message: 'Login successful', data: { token, user: payload } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const person = await Person.findByPk(req.user.userId, { attributes: { exclude: ['Password'] } });
    if (!person) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Profile retrieved', data: person });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};
