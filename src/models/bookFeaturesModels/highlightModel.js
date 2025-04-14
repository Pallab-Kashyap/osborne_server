// models/Highlight.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

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
  x: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  y: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  height: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  width: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pageNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'highlights',
  timestamps: false,
});

module.exports = Highlight;
