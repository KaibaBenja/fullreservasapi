import { Sequelize } from 'sequelize';
import { MYSQL } from "../config/dotenv.config";
import mysql2 from 'mysql2';

const sequelize = new Sequelize(
  MYSQL.DATABASE,  
  MYSQL.USER,      
  MYSQL.PASSWORD,  
  {
    host: MYSQL.HOST,   
    port: MYSQL.PORT,   
    dialect: "mysql",  
    dialectModule: mysql2,
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
