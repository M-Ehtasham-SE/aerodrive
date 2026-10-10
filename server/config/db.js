const { Sequelize } = require('sequelize');
require('dotenv').config();

// Render PostgreSQL database credentials provided by user
const RENDER_DB_URL = 'postgresql://aerodrive_db_user:0vUt1xZZ0NLMMDi9aTb0jUR2qKiXVkYB@dpg-db4stl2jnfac738duivg-a.oregon-postgres.render.com/aerodrive_db';

let dbUrl = process.env.DATABASE_URL;

// If DATABASE_URL is not set or points to the old dead aivencloud database:
if (!dbUrl || dbUrl.includes('aivencloud.com')) {
  if (process.env.DB_HOST && !process.env.DB_HOST.includes('aivencloud.com')) {
    dbUrl = null;
  } else {
    dbUrl = RENDER_DB_URL;
  }
}

const sequelize = dbUrl
  ? new Sequelize(dbUrl, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.DB_SSL === 'false' ? false : {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
    })
  : new Sequelize(
      process.env.DB_NAME || 'aerodrive_db',
      process.env.DB_USER || 'aerodrive_db_user',
      process.env.DB_PASS || '0vUt1xZZ0NLMMDi9aTb0jUR2qKiXVkYB',
      {
        host: process.env.DB_HOST || 'dpg-db4stl2jnfac738duivg-a.oregon-postgres.render.com',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
          ssl: process.env.DB_SSL === 'false' ? false : {
            require: true,
            rejectUnauthorized: false
          }
        },
        logging: false,
        pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
      }
    );

module.exports = sequelize;
