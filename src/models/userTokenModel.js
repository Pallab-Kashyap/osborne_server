// models/userTokenModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 
import User from './userModel.js';       

const UserToken = sequelize.define('UserToken', {
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  time_created: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  time_expired: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'user_tokens', 
  timestamps: true,         
});



export default UserToken;
