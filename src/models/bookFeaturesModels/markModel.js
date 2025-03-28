// models/Mark.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

const Mark = sequelize.define('Mark', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
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
