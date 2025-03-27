import sequelize from '../config/db.js';
import User from './userModel.js';
import UserToken from './userTokenModel.js';
import Device from './deviceModel.js';
import RemoteUserToken from './remoteUserTokenModel.js';

const syncDB = async () => {

try {
  User.hasOne(RemoteUserToken, { foreignKey: 'userId' });
  Device.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
  RemoteUserToken.belongsTo(User, { foreignKey: 'userId' });
  UserToken.belongsTo(User, { foreignKey: 'userId' });
  UserToken.belongsTo(User, { foreignKey: 'user_id' });
  
  await sequelize.sync({ alter: true }); 
  
} catch (error) {
  console.log(error);
}
  
}

export {
  User,
  UserToken,
  Device,
  RemoteUserToken,
  sequelize,
  syncDB
};
