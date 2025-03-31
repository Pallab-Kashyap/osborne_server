const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db.js");

const UserToken = sequelize.define(
  "UserToken",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      referances: {
        model: "user",
        key: "id",
      },
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    time_expired: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user_tokens",
    timestamps: true,
  }
);

module.exports = UserToken;
