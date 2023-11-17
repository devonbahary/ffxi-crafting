import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const { MYSQL_DATABASE, MYSQL_PASSWORD, MYSQL_USER, MYSQL_HOST } = process.env;

export const sequelize = new Sequelize({
    database: MYSQL_DATABASE,
    password: MYSQL_PASSWORD,
    username: MYSQL_USER,
    host: MYSQL_HOST,
    dialect: 'mysql',
});

sequelize
    .authenticate()
    .then(() => {
        console.log(`Sequelize authenticated`);
    })
    .catch((err) => {
        console.error(`Sequelize error authenticating:`, err);
    });
