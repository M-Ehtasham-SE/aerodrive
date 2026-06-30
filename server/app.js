const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const fs = require('fs');

const app = express();

const uploadDir = path.join(__dirname, 'uploads', 'damage-photos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors({ origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',        require('./routes/auth.routes'));
app.use('/api/vehicles',    require('./routes/vehicle.routes'));
app.use('/api/models',      require('./routes/model.routes'));
app.use('/api/customers',   require('./routes/customer.routes'));
app.use('/api/reservations',require('./routes/reservation.routes'));
app.use('/api/contracts',   require('./routes/contract.routes'));
app.use('/api/payments',    require('./routes/payment.routes'));
app.use('/api/damage',      require('./routes/damage.routes'));
app.use('/api/maintenance', require('./routes/maintenance.routes'));
app.use('/api/insurance',   require('./routes/insurance.routes'));
app.use('/api/branches',    require('./routes/branch.routes'));
app.use('/api/staff',       require('./routes/staff.routes'));
app.use('/api/dashboard',   require('./routes/dashboard.routes'));

if (!process.env.JWT_SECRET) {
  console.error('CRITICAL: JWT_SECRET is not defined in .env file!');
}

if (require.main === module) {
  const { sequelize } = require('./models');
  sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Database connection failed:', err.message));

  app.listen(process.env.PORT || 5000, () =>
    console.log(`AeroDrive server running on port ${process.env.PORT || 5000}`)
  );
}

module.exports = app;
