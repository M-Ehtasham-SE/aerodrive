const { Person, Staff, Mechanic } = require('../models');

async function fix() {
  try {
    console.log('Searching for staff members with position Mechanic...');
    const mechanics = await Staff.findAll({ where: { Position: 'Mechanic' } });
    
    for (const s of mechanics) {
      const exists = await Mechanic.findByPk(s.PersonID);
      if (!exists) {
        console.log(`Adding ${s.PersonID} to Mechanic table...`);
        await Mechanic.create({ 
          PersonID: s.PersonID, 
          Specialization: 'General' 
        });
        console.log(`Success: PersonID ${s.PersonID} is now a registered Mechanic.`);
      } else {
        console.log(`PersonID ${s.PersonID} is already a registered Mechanic.`);
      }
    }
    console.log('Fix completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing mechanics:', error);
    process.exit(1);
  }
}

fix();
