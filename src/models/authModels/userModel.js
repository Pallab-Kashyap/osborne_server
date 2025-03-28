const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db.js");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "user",
    timestamps: true,
  }
);

module.exports = User;
