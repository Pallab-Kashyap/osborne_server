// models/Bookmark.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

const Bookmark = sequelize.define('Bookmark', {
  id: {
    type: DataTypes.STRING, // Use CHAR if you need fixed-length
    primaryKey: true,
    allowNull: false,
  },
  page: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'bookmarks',
  timestamps: false,
});

module.exports = Bookmark;
