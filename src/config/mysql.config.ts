import { MYSQL_PASSWORD } from "../config/dotenv.config";
import mysql from 'mysql2';


const connection = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: MYSQL_PASSWORD,
  database: 'fullreservas',
  charset: 'utf8mb4'
}).promise();

export default connection;