const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = connection.define('categories', {
    tittle: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


module.exports = Category;
