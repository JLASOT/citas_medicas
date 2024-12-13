import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Asegúrate de incluir el puerto
    dialect: 'mysql',
    
});

sequelize.authenticate()
    .then(() => console.log('CONECTADO A LA BASE DE DATOS MYSQL'))
    .catch(err => console.log('ERROR AL CONECTAR A MYSQL:', err));

export default sequelize;
