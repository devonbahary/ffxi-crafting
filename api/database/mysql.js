import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_ROOT_PASSWORD, MYSQL_DATABASE } =
  process.env;

const connection = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_ROOT_PASSWORD,
  database: MYSQL_DATABASE,
});

export default connection;
