import { Sequelize } from 'sequelize';
import { MYSQL} from "../config/dotenv.config";
import mysql2 from 'mysql2';

const sequelize = new Sequelize(MYSQL.DATABASE, MYSQL.USER, MYSQL.PASSWORD, {
  host: MYSQL.HOST,
  dialect: 'mysql',
  dialectModule: mysql2,  // Utiliza mysql2 como el módulo para manejar la base de datos
  pool: {
    max: 5,               // Número máximo de conexiones en el pool
    min: 0,               // Número mínimo de conexiones en el pool
    acquire: 30000,       // Tiempo máximo de espera para obtener una conexión
    idle: 10000           // Tiempo de inactividad antes de liberar una conexión
  },
  logging: false,  // Desactivar el log de consultas SQL (opcional)
});

export { sequelize };
