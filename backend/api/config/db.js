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

const runMigrations = async (queryInterface) => {
  try {
    console.log("Running schema migrations...");
    // Users table new columns
    await sequelize.query("ALTER TABLE Users ADD COLUMN IF NOT EXISTS gmailConnected TINYINT(1) DEFAULT 0;");
    await sequelize.query("ALTER TABLE Users ADD COLUMN IF NOT EXISTS gmailAccessToken TEXT;");
    await sequelize.query("ALTER TABLE Users ADD COLUMN IF NOT EXISTS gmailRefreshToken TEXT;");
    await sequelize.query("ALTER TABLE Users ADD COLUMN IF NOT EXISTS gmailTokenExpiresAt DATETIME;");

    // Expenses table new columns
    await sequelize.query("ALTER TABLE Expenses ADD COLUMN IF NOT EXISTS entrySource VARCHAR(50) DEFAULT 'manual';");
    await sequelize.query("ALTER TABLE Expenses ADD COLUMN IF NOT EXISTS emailId VARCHAR(255) DEFAULT NULL;");
    await sequelize.query("ALTER TABLE Expenses ADD COLUMN IF NOT EXISTS rawText TEXT DEFAULT NULL;");
    await sequelize.query("ALTER TABLE Expenses ADD COLUMN IF NOT EXISTS bankAccountId INT DEFAULT NULL;");

    // Incomes table new columns
    await sequelize.query("ALTER TABLE Incomes ADD COLUMN IF NOT EXISTS entrySource VARCHAR(50) DEFAULT 'manual';");
    await sequelize.query("ALTER TABLE Incomes ADD COLUMN IF NOT EXISTS emailId VARCHAR(255) DEFAULT NULL;");
    await sequelize.query("ALTER TABLE Incomes ADD COLUMN IF NOT EXISTS rawText TEXT DEFAULT NULL;");
    await sequelize.query("ALTER TABLE Incomes ADD COLUMN IF NOT EXISTS bankAccountId INT DEFAULT NULL;");

    console.log("Schema migrations completed successfully.");
  } catch (migrationError) {
    console.error("Migration error (safe to ignore if columns already exist):", migrationError);
  }
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("TiDB Cloud connected successfully.");
    
    // Sync models - using basic sync to create new tables (e.g. PendingTransactions)
    await sequelize.sync(); 
    
    // Run schema migrations for existing tables
    await runMigrations();
  } catch (err) {
    console.error("Error connecting to TiDB:", err);
    process.exit(1);
  }
};

// Export to resolve circular references before preloading models
module.exports = { sequelize, connectDB };

// Preload models so they are registered with Sequelize prior to sync
require("../models/User");
require("../models/Expense");
require("../models/Income");
require("../models/PendingTransaction");
require("../models/BankAccount");