const { Pool } = require('pg')
const dotenv = require('dotenv')
const { Sequelize } = require('sequelize')
dotenv.config()

const pool = new Pool({
    connectionString: process.env.DB_URL,
})

const sequelize = new Sequelize(process.env.DB_URL, {
  logging: false
})

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected successfully');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}


module.exports = {
    connectDB,
    pool,
    sequelize
}