const { sequelize } = require("../config/db.js");
const User = require("./authModels/userModel.js");
const UserToken = require("./authModels/userTokenModel.js");
const Device = require("./authModels/deviceModel.js");
const RemoteUserToken = require("./authModels/remoteUserTokenModel.js");
const Bookmark = require("./bookFeaturesModels/bookmarkModel");
const Mark = require("./bookFeaturesModels/markModel");
const Note = require("./bookFeaturesModels/noteModel");
const Highlight = require("./bookFeaturesModels/highlightModel");

const syncDB = async () => {
  //AUTH
  User.hasOne(RemoteUserToken, { foreignKey: "userId" });
  Device.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
  RemoteUserToken.belongsTo(User, { foreignKey: "userId" });
  UserToken.belongsTo(User, { foreignKey: "userId" });
  UserToken.belongsTo(User, { foreignKey: "user_id" });

  await sequelize.sync({});

  console.log("Sync completed");
};

module.exports = {
  User,
  UserToken,
  Device,
  RemoteUserToken,
  sequelize,
  syncDB,
};
