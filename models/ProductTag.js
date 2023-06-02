// Import necessary modules from Sequelize
const { Model, DataTypes } = require("sequelize");

// Import the sequelize instance for connecting to the database
const sequelize = require("../config/connection");

// Create a new class called ProductTag that extends the Model class provided by Sequelize
class ProductTag extends Model {}

// Initialize the ProductTag model with the table's attributes and options
ProductTag.init(
  {
    // Define the id attribute
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    // Define the product_id attribute
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "product",
        key: "id",
      },
    },

    // Define the tag_id attribute
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "tag",
        key: "id",
      },
    },
  },
  {
    // Set the sequelize instance for the model
    sequelize,

    // Disable timestamps (createdAt and updatedAt)
    timestamps: false,

    // Use the singular form of the table name
    freezeTableName: true,

    // Use underscores instead of camelCase for automatically added attributes
    underscored: true,

    // Set the model name
    modelName: "product_tag",
  }
);

// Export the ProductTag model for use in other parts of the application
module.exports = ProductTag;
