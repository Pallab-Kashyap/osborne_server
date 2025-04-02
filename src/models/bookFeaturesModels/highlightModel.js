// models/Highlight.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

const Highlight = sequelize.define('Highlight', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  publication_reader_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'publication_readers',
      key: 'id'
    }
  },
  page: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  end: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'highlights',
  timestamps: false,
});

module.exports = Highlight;
