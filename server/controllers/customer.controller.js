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
    
    // Compute age (if view is not queried directly, compute in JS or use raw query)
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

    const person = await Person.create({ FirstName: firstName, LastName: lastName, Phone: phone, Password: password }, { transaction: t });
    
    const customer = await Customer.create({
      PersonID: person.PersonID, CNIC: cnic, LicenseNo: licenseNo, DateOfBirth: dateOfBirth, Occupation: occupation
    }, { transaction: t });

    if (emails?.length) await CustomerEmail.bulkCreate(emails.map(e => ({ PersonID: person.PersonID, Email: e })), { transaction: t });
    if (paymentMethods?.length) await CustomerPaymentMethod.bulkCreate(paymentMethods.map(p => ({ PersonID: person.PersonID, PaymentMethod: p })), { transaction: t });
    if (emergencyContacts?.length) {
      await EmergencyContact.bulkCreate(emergencyContacts.map(ec => ({
        PersonID: person.PersonID, // Emergency contact creates a person record too ideally, but schema has EmergencyContact table directly linked to Person
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
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    
    await customer.update(req.body);
    // Note: handling emails/payment methods updates would go here
    res.json({ success: true, message: 'Customer updated', data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update customer', error: error.message });
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
