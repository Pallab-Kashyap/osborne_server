// models/Bookmark.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

const Bookmark = sequelize.define('Bookmark', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: () => uuidv4()
  },
  publicationReaderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'publication_readers',
      key: 'id'
    }
  },
  page: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  tableName: 'bookmarks',
  timestamps: true,
});

module.exports = Bookmark;
