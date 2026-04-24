const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
// We will add other routes as we build them:
// app.use('/api/vehicles',    require('./routes/vehicle.routes'));
// app.use('/api/customers',   require('./routes/customer.routes'));
// app.use('/api/reservations',require('./routes/reservation.routes'));
// app.use('/api/contracts',   require('./routes/contract.routes'));
// app.use('/api/payments',    require('./routes/payment.routes'));
// app.use('/api/damage',      require('./routes/damage.routes'));
// app.use('/api/maintenance', require('./routes/maintenance.routes'));
// app.use('/api/insurance',   require('./routes/insurance.routes'));
// app.use('/api/branches',    require('./routes/branch.routes'));
// app.use('/api/staff',       require('./routes/staff.routes'));
// app.use('/api/dashboard',   require('./routes/dashboard.routes'));

if (require.main === module) {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`AeroDrive server running on port ${process.env.PORT || 5000}`)
  );
}

module.exports = app;
