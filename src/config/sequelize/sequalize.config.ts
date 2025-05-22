import mysql2 from 'mysql2';
import { Sequelize } from 'sequelize';
import { MYSQL } from "../dotenv.config";

const sequelize = new Sequelize(
  MYSQL.DATABASE,  
  MYSQL.USER,      
  MYSQL.PASSWORD,  
  {
    host: MYSQL.HOST,   
    port: MYSQL.PORT,   
    dialect: "mysql",  
    dialectModule: mysql2,
    dialectOptions: {
      dateStrings: true, // Evita que Sequelize convierta a objeto Date automáticamente
      typeCast: true,    // Para asegurarte de recibir strings, no Date
    },
    timezone: "-03:00",
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    logging: false, // Desactiva logs de Sequelize
  }
);

export { sequelize };
