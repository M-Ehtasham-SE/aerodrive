const { Person, sequelize } = require('./models');
const { Op } = require('sequelize');

async function cleanup() {
  console.log('--- DB CLEANUP: REMOVING DUPLICATE ACCOUNTS ---');
  try {
    // Find all phone numbers that have more than one record
    const [duplicates] = await sequelize.query(`
      SELECT Phone, COUNT(*) as count 
      FROM person 
      GROUP BY Phone 
      HAVING count > 1
    `);

    console.log(`Found ${duplicates.length} duplicate phone numbers.`);

    for (const dup of duplicates) {
      console.log(`Cleaning up Phone: ${dup.Phone}...`);
      
      // Get all records for this phone, ordered by ID (oldest first)
      const records = await Person.findAll({
        where: { Phone: dup.Phone },
        order: [['PersonID', 'ASC']]
      });

      // Keep the first one, delete the rest
      const [original, ...toDelete] = records;
      
      for (const record of toDelete) {
        console.log(`  Deleting PersonID: ${record.PersonID} (Keep: ${original.PersonID})`);
        await record.destroy();
      }
    }

    console.log('✅ Cleanup completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Cleanup failed:', err.message);
    process.exit(1);
  }
}

cleanup();
