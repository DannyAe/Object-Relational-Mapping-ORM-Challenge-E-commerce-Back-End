// Load environment variables from .env file
require('dotenv').config();

// Import the Sequelize module
const Sequelize = require('sequelize');

// Create a Sequelize instance for connecting to the database
const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL) // If JAWSDB_URL is present (production environment)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      // If JAWSDB_URL is not present (local environment)
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
    });

// Export the sequelize instance for use in other parts of the application
module.exports = sequelize;
