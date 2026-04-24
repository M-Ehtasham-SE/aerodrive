require('dotenv').config();
const { Person } = require('./models');
async function check() {
  try {
    const people = await Person.findAll();
    console.log('Total people in DB:', people.length);
    people.forEach(p => console.log(`- ${p.Phone}: ${p.FirstName}`));
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}
check();
