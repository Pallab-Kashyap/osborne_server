const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/db.js");

const Device = sequelize.define(
  "Device",
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
    device_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    os_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    register_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "devices",
    timestamps: false,
  }
);

module.exports = Device;
