const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.TIDB_DATABASE,
  process.env.TIDB_USER,
  process.env.TIDB_PASSWORD,
  {
    host: process.env.TIDB_HOST,
    port: process.env.TIDB_PORT || 4000,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      },
    },
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("TiDB Cloud connected successfully.");
    
    // Sync models - using basic sync to avoid TiDB ALTER TABLE limitations
    // Use { force: true } once if you need to reset the database schema
    await sequelize.sync(); 
  } catch (err) {
    console.error("Error connecting to TiDB:", err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };