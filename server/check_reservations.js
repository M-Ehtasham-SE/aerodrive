require('dotenv').config();
const { Reservation, Customer, Person } = require('./models');

async function check() {
  try {
    const res = await Reservation.findAll({
      include: [{ model: Customer, include: [Person] }]
    });
    console.log('Total Reservations in DB:', res.length);
    res.forEach(r => {
      console.log(`ID: ${r.ReservationID}, Customer: ${r.Customer?.Person?.FirstName} ${r.Customer?.Person?.LastName}, CustomerID: ${r.CustomerID}`);
    });

    const people = await Person.findAll();
    console.log('\nPeople in DB:');
    people.forEach(p => console.log(`ID: ${p.PersonID}, Name: ${p.FirstName}, Role Logic: (Check if exists in Staff/Customer)`));

    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}
check();
