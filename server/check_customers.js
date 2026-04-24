require('dotenv').config();
const { Customer, Person } = require('./models');

async function check() {
  try {
    const customers = await Customer.findAll({ include: [Person] });
    console.log('Customers in DB:');
    customers.forEach(c => {
      console.log(`PersonID: ${c.PersonID}, Name: ${c.Person?.FirstName} ${c.Person?.LastName}`);
    });
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}
check();
