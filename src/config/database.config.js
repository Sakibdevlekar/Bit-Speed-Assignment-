require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    database: process.env.DB_NAME, //DB name
    username: process.env.DB_USERNAME, // DB username 
    password: process.env.DB_PASSWORD, // DB password 
    dialect: "mysql",
    host: process.env.DB_HOST, 
    logging:false
});

module.exports = sequelize;
