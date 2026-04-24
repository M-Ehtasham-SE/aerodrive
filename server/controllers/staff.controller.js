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
    
    const person = await Person.create({ FirstName: firstName, LastName: lastName, Phone: phone, Password: password }, { transaction: t });
    
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
    const { role, subclassData, ...staffData } = req.body;
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff not found' });

    await staff.update(staffData, { transaction: t });
    
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
