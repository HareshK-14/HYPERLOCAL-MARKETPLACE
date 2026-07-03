/**
 * db-setup.js — Run this script to initialize the database on a fresh deployment.
 * Usage: node db-setup.js
 *
 * What it does:
 *  1. Connects to MySQL using env variables
 *  2. Creates the database if it doesn't exist
 *  3. Syncs all Sequelize models (creates/updates tables)
 *  4. Exits cleanly
 */

import dotenv from 'dotenv';
import mysql2 from 'mysql2/promise';
import { sequelize } from './config/db.js';

// Import ALL models so Sequelize registers them before sync
import './models/User.js';
import './models/Product.js';

dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME = 'locallink',
  DB_PORT = 3306,
} = process.env;

const run = async () => {
  console.log('🔧 LocalLink DB Setup Starting...\n');

  // Step 1: Create the database if it doesn't exist
  console.log(`📡 Connecting to MySQL at ${DB_HOST}:${DB_PORT}...`);
  const conn = await mysql2.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  console.log(`🗄️  Creating database "${DB_NAME}" if it doesn't exist...`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await conn.end();
  console.log(`✅ Database "${DB_NAME}" is ready.\n`);

  // Step 2: Sync all models (create/alter tables)
  console.log('📋 Syncing Sequelize models (creating tables)...');
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log('✅ All tables created/updated successfully.\n');

  console.log('🎉 Database setup complete! Your LocalLink DB is ready.');
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ DB Setup Failed:', err.message);
  process.exit(1);
});
