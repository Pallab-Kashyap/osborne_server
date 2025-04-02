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

   // Note associations
   PublicationReader.hasOne(Note, { 
    foreignKey: "publicationReaderId",
    sourceKey: "id",
    onDelete: 'CASCADE'
  });
  Note.belongsTo(PublicationReader, { 
    foreignKey: "publicationReaderId",
    targetKey: "id"
  });

  // Bookmark associations
  PublicationReader.hasOne(Bookmark, { 
    foreignKey: "publicationReaderId",
    sourceKey: "id",
    onDelete: 'CASCADE'
  });
  Bookmark.belongsTo(PublicationReader, { 
    foreignKey: "publicationReaderId",
    targetKey: "id"
  });

  // Sync both tables to ensure foreign key constraints are properly set up
  // await PublicationReader.sync({ alter: true });
  // await Note.sync({ alter: true });
  // await Bookmark.sync({ force: true });
await sequelize.sync({ alter: true });
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
  Bookmark,
  Mark,
  Note,
  Highlight
};
