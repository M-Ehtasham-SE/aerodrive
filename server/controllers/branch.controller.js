const { Branch, Staff, Vehicle, sequelize } = require('../models');

exports.getBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll({
      include: [
        { model: Staff, attributes: ['PersonID'] },
        { model: Vehicle, attributes: ['VehicleID'] }
      ]
    });
    // Calculate counts
    const data = branches.map(b => {
      const branchJson = b.toJSON();
      branchJson.StaffCount = branchJson.Staffs ? branchJson.Staffs.length : 0;
      branchJson.VehicleCount = branchJson.Vehicles ? branchJson.Vehicles.length : 0;
      delete branchJson.Staffs;
      delete branchJson.Vehicles;
      return branchJson;
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch branches', error: error.message });
  }
};

exports.createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, message: 'Branch created', data: branch });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create branch', error: error.message });
  }
};
