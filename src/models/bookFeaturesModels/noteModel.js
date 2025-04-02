// // models/Note.js
// const { DataTypes } = require('sequelize');
// const {sequelize} = require('../../config/db');

// const Note = sequelize.define('Note', {
//   id: {
//     type: DataTypes.STRING,
//     primaryKey: true,
//     allowNull: false,
//   },
//   page: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
//   x: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   y: {
//     type: DataTypes.FLOAT,
//     allowNull: false,
//   },
//   color: {
//     type: DataTypes.BIGINT, 
//     allowNull: false,
//   },
//   text: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   publication_id: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
// }, {
//   tableName: 'notes',
//   timestamps: false,
// });

// module.exports = Note;

// models/Note.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

const Note = sequelize.define('Note', {
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
    allowNull: false,
  },
  x: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  y: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  color: {
    type: DataTypes.BIGINT, 
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  publication_id: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'notes',
  timestamps: true,
});

module.exports = Note;