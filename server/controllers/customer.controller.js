const bcrypt = require('bcryptjs');
const { Customer, Person, CustomerEmail, CustomerPaymentMethod, EmergencyContact, Reservation, Vehicle, sequelize } = require('../models');

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [
        { model: Person, attributes: ['FirstName', 'LastName', 'Phone', 'City'] }
      ]
    });
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [
        Person,
        CustomerEmail,
        CustomerPaymentMethod,
        { model: EmergencyContact, as: 'EmergencyContacts' }
      ]
    });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    
    const [viewData] = await sequelize.query(`SELECT Age FROM v_customer WHERE PersonID = ${req.params.id}`);
    const customerData = customer.toJSON();
    if (viewData && viewData[0]) customerData.Age = viewData[0].Age;

    res.json({ success: true, data: customerData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer', error: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, phone, password, cnic, licenseNo, dateOfBirth, occupation, emails, paymentMethods, emergencyContacts } = req.body;
    
    const existing = await Person.findOne({ where: { Phone: phone } });
    if (existing) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const person = await Person.create({ FirstName: firstName, LastName: lastName, Phone: phone, Password: hashedPassword }, { transaction: t });
    
    const customer = await Customer.create({
      PersonID: person.PersonID, CNIC: cnic, LicenseNo: licenseNo, DateOfBirth: dateOfBirth, Occupation: occupation
    }, { transaction: t });

    if (emails?.length) await CustomerEmail.bulkCreate(emails.map(e => ({ PersonID: person.PersonID, Email: e })), { transaction: t });
    if (paymentMethods?.length) await CustomerPaymentMethod.bulkCreate(paymentMethods.map(p => ({ PersonID: person.PersonID, PaymentMethod: p })), { transaction: t });
    if (emergencyContacts?.length) {
      await EmergencyContact.bulkCreate(emergencyContacts.map(ec => ({
        PersonID: person.PersonID,
        CustomerID: person.PersonID,
        Relationship: ec.Relationship,
        Priority: ec.Priority
      })), { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Customer created', data: customer });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create customer', error: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, phone, ...customerData } = req.body;
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    await customer.update(customerData, { transaction: t });
    
    if (firstName || lastName || phone) {
      await Person.update(
        { FirstName: firstName, LastName: lastName, Phone: phone },
        { where: { PersonID: customer.PersonID }, transaction: t }
      );
    }

    await t.commit();
    res.json({ success: true, message: 'Customer updated', data: customer });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to update customer', error: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Check for reservations
    const reservations = await Reservation.count({ where: { CustomerID: req.params.id } });
    if (reservations > 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Cannot delete customer with active or past reservations' });
    }

    const personID = customer.PersonID;
    
    // Delete related data first
    await CustomerEmail.destroy({ where: { PersonID: personID }, transaction: t });
    await CustomerPaymentMethod.destroy({ where: { PersonID: personID }, transaction: t });
    await EmergencyContact.destroy({ where: { PersonID: personID }, transaction: t });
    
    // Delete customer and person
    await customer.destroy({ transaction: t });
    await Person.destroy({ where: { PersonID: personID }, transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to delete customer', error: error.message });
  }
};

exports.getCustomerReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { CustomerID: req.params.id },
      include: [Vehicle]
    });
    res.json({ success: true, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reservations', error: error.message });
  }
};
