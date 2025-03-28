const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db.js");

const RemoteUserToken = sequelize.define(
  "RemoteUserToken",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      referances: {
        model: "user",
        key: "id",
      },
    },
    time_expired: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "remote_user_token",
    timestamps: true,
  }
);

module.exports = RemoteUserToken;
