import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const {
    NODE_ENV,
    MYSQL_DATABASE,
    MYSQL_TEST_DATABASE,
    MYSQL_PASSWORD,
    MYSQL_USER,
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_TEST_PORT,
} = process.env;

const database = NODE_ENV === 'test' ? MYSQL_TEST_DATABASE : MYSQL_DATABASE;
const port = NODE_ENV === 'test' ? MYSQL_TEST_PORT : MYSQL_PORT;

export const sequelize = new Sequelize({
    database,
    password: MYSQL_PASSWORD,
    username: MYSQL_USER,
    host: MYSQL_HOST,
    dialect: 'mysql',
    port: port !== undefined ? parseInt(port) : undefined,
    logging: false,
});

sequelize
    .authenticate()
    .then(() => {
        console.log(`Sequelize authenticated with ${database} on port ${port}`);
    })
    .catch((err) => {
        console.error(`Sequelize error authenticating:`, err);
    });
