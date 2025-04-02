// models/Mark.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

const Mark = sequelize.define('Mark', {
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
  x: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  y: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'marks',
  timestamps: false,
});

module.exports = Mark;
