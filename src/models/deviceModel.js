import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";

const Device = sequelize.define(
  "Device",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      referances: {
        model: "user",
        key: "id",
      },
    },
    os_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    register_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "devices",
    timestamps: false,
  }
);

export default Device;
