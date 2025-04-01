const { sequelize } = require("../config/db.js");
const User = require("./authModels/userModel.js");
const UserToken = require("./authModels/userTokenModel.js");
const Device = require("./authModels/deviceModel.js");
const RemoteUserToken = require("./authModels/remoteUserTokenModel.js");
const Bookmark = require("./bookFeaturesModels/bookmarkModel");
const Mark = require("./bookFeaturesModels/markModel");
const Note = require("./bookFeaturesModels/noteModel");
const Highlight = require("./bookFeaturesModels/highlightModel");
const PublicationReader = require("./bookFeaturesModels/publicationReaderModel");

const syncDB = async () => {
  //AUTH
  User.hasOne(RemoteUserToken, { foreignKey: "userId", onDelete: "CASCADE" });
  Device.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
  RemoteUserToken.belongsTo(User, { foreignKey: "userId" });
  UserToken.belongsTo(User, { foreignKey: "userId" });
  UserToken.belongsTo(User, { foreignKey: "user_id" });
  
  // Publication Reader relations
  User.hasMany(PublicationReader, { foreignKey: "userId" });
  PublicationReader.belongsTo(User, { foreignKey: "userId" });

  
// Bookmark associations
Bookmark.belongsTo(PublicationReader, { foreignKey: "id" });
PublicationReader.hasOne(Bookmark, { foreignKey: "id" });

  await sequelize.sync({});
  // await PublicationReader.sync({ force: true });

  console.log("Sync completed")
};

module.exports = {
  User,
  UserToken,
  Device,
  RemoteUserToken,
  PublicationReader,
  sequelize,
  syncDB,
};
