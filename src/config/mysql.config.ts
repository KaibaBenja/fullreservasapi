import { MYSQL } from "../config/dotenv.config";
import mysql from 'mysql2';

const connection = mysql.createPool({
  host: MYSQL.HOST,
  port: MYSQL.PORT,
  user: MYSQL.USER,
  password: MYSQL.PASSWORD,
  database: MYSQL.DATABASE,
  charset: 'utf8mb4'
}).promise();

export default connection;