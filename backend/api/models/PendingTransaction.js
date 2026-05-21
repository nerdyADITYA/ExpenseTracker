const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PendingTransaction = sequelize.define("PendingTransaction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("income", "expense"),
    allowNull: false,
  },
  merchant: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  emailId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  rawText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "deleted"),
    defaultValue: "pending",
  },
  bankAccountId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  detectedBankName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  detectedAccountNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Alias for _id to maintain compatibility with frontend
PendingTransaction.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = PendingTransaction;
