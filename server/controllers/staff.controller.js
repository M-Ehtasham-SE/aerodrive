const bcrypt = require('bcryptjs');
const { Staff, Person, Manager, Clerk, Mechanic, Branch, sequelize } = require('../models');

exports.getStaff = async (req, res) => {
  try {
    const { role } = req.query;
    let includeClause = [{ model: Person, attributes: ['FirstName', 'LastName', 'Phone'] }, { model: Branch, attributes: ['BranchName'] }];
    
    if (role === 'manager') includeClause.push({ model: Manager, required: true });
    else if (role === 'clerk') includeClause.push({ model: Clerk, required: true });
    else if (role === 'mechanic') includeClause.push({ model: Mechanic, required: true });
    else includeClause.push(Manager, Clerk, Mechanic);

    const staff = await Staff.findAll({ include: includeClause });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch staff', error: error.message });
  }
};

exports.createStaff = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, phone, password, role, subclassData, ...staffData } = req.body;
    
    const existing = await Person.findOne({ where: { Phone: phone } });
    if (existing) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const person = await Person.create({ FirstName: firstName, LastName: lastName, Phone: phone, Password: hashedPassword }, { transaction: t });
    
    const staff = await Staff.create({ PersonID: person.PersonID, Position: role, ...staffData }, { transaction: t });

    if (role === 'manager') {
      await Manager.create({ PersonID: person.PersonID, ...subclassData }, { transaction: t });
    } else if (role === 'clerk') {
      await Clerk.create({ PersonID: person.PersonID, ...subclassData }, { transaction: t });
    } else if (role === 'mechanic') {
      await Mechanic.create({ PersonID: person.PersonID, ...subclassData }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Staff created', data: staff });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create staff', error: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { firstName, lastName, phone, role, subclassData, ...staffData } = req.body;
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    await staff.update(staffData, { transaction: t });
    
    if (firstName || lastName || phone) {
      await Person.update(
        { FirstName: firstName, LastName: lastName, Phone: phone },
        { where: { PersonID: staff.PersonID }, transaction: t }
      );
    }
    
    if (role === 'manager') await Manager.update(subclassData, { where: { PersonID: staff.PersonID }, transaction: t });
    else if (role === 'clerk') await Clerk.update(subclassData, { where: { PersonID: staff.PersonID }, transaction: t });
    else if (role === 'mechanic') await Mechanic.update(subclassData, { where: { PersonID: staff.PersonID }, transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Staff updated', data: staff });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to update staff', error: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    const personID = staff.PersonID;
    const role = staff.Position;

    // Delete subclass data
    if (role === 'manager') await Manager.destroy({ where: { PersonID: personID }, transaction: t });
    else if (role === 'clerk') await Clerk.destroy({ where: { PersonID: personID }, transaction: t });
    else if (role === 'mechanic') await Mechanic.destroy({ where: { PersonID: personID }, transaction: t });

    // Delete staff and person
    await staff.destroy({ transaction: t });
    await Person.destroy({ where: { PersonID: personID }, transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Staff deleted successfully' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to delete staff', error: error.message });
  }
};
