const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const User = require('../authModels/userModel');

const PublicationReader = sequelize.define('PublicationReader', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  publicationId: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'publication_readers',
  timestamps: true
});

// Define associations
PublicationReader.belongsTo(User, { foreignKey: 'userId' });

module.exports = PublicationReader;
