const { Sequelize } = require('sequelize');
require('dotenv').config();

// All connection details come from environment variables.
// Never commit credentials or connection strings to the repository.
//
// Option A: DATABASE_URL=postgres://user:password@host:5432/dbname
// Option B: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
// DB_DIALECT defaults to "postgres" (the dialect the app and seed script are written for).
// Set DB_SSL=false for a local database without SSL.

const dialect = process.env.DB_DIALECT || 'postgres';
const useSsl = process.env.DB_SSL !== 'false' && dialect === 'postgres';

const options = {
  dialect,
  logging: false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {}
};

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, options);
} else if (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS || '',
    {
      ...options,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || (dialect === 'mysql' ? 3306 : 5432)
    }
  );
} else {
  throw new Error(
    'Database is not configured. Set DATABASE_URL or DB_HOST, DB_NAME, DB_USER and DB_PASS in server/.env'
  );
}

module.exports = sequelize;
