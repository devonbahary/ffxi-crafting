require('dotenv').config();

const {
    MYSQL_DATABASE,
    MYSQL_TEST_DATABASE,
    MYSQL_PASSWORD,
    MYSQL_USER,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_TEST_PORT,
} = process.env;

const config = {
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    host: MYSQL_HOST,
    dialect: 'mysql',
    port: MYSQL_PORT,
    dialectOptions: {
        multipleStatements: true,
    },
};

module.exports = {
    development: config,
    test: {
        ...config,
        database: MYSQL_TEST_DATABASE,
        port: MYSQL_TEST_PORT,
    },
    production: config,
};
