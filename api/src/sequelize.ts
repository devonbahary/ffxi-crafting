import { type Options, Sequelize } from 'sequelize';
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
    CLEARDB_DATABASE_URL,
} = process.env;

const database = NODE_ENV === 'test' ? MYSQL_TEST_DATABASE : MYSQL_DATABASE;
const port = NODE_ENV === 'test' ? MYSQL_TEST_PORT : MYSQL_PORT;

const options: Options = {
    database,
    password: MYSQL_PASSWORD,
    username: MYSQL_USER,
    host: MYSQL_HOST,
    dialect: 'mysql',
    port: port !== undefined ? parseInt(port) : undefined,
    logging: false,
};

export const sequelize =
    typeof CLEARDB_DATABASE_URL === 'string'
        ? new Sequelize(CLEARDB_DATABASE_URL)
        : new Sequelize(options);

sequelize
    .authenticate()
    .then(() => {
        console.log(`Sequelize authenticated with ${database} on port ${port}`);
    })
    .catch((err) => {
        console.error(`Sequelize error authenticating:`, err);
    });
