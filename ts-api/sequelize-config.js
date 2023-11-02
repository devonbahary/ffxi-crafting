require('dotenv').config();

const { MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER, MYSQL_HOST } = process.env;

const config = {
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    host: MYSQL_HOST,
    dialect: 'mysql',
};

module.exports = {
    development: config,
    test: config,
    production: config,
};
