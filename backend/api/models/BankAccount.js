const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const BankAccount = sequelize.define("BankAccount", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accountHolderName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accountType: {
    type: DataTypes.STRING,
    defaultValue: "Savings",
  },
  initialBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
}, {
  timestamps: true,
});

// Alias for _id to maintain compatibility with frontend elements
BankAccount.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

module.exports = BankAccount;
