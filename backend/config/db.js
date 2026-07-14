import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sslEnabled = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'locallink',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Haresh@1401',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    dialectOptions: sslEnabled
      ? {
          ssl: {
            rejectUnauthorized: true,
            minVersion: 'TLSv1.2',
          },
        }
      : {},
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`MySQL Connected: ${sequelize.config.host}`);

    // Sync models (uncomment when models are defined)
    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
