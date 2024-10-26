import express from 'express'
import cors from 'cors'
import path from 'path'
import sequelize from './config/database';
import router from './router'
import * as dotenv from 'dotenv'
import './models/Day'; // Asegúrate de que este modelo esté importado para que se sincronice

dotenv.config()


const syncDatabase = async () => {
    try {
        await sequelize.sync(); // Crea la tabla si no existe
        console.log("Tablas sincronizadas con la base de datos- SISTEMA FUNCIONAL  ");
    } catch (err) {
        console.error("Error al sincronizar las tablas:", err);
        process.exit(1); // Sale del proceso si falla la sincronización
    }
};  

syncDatabase();


const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))
app.use('/api/',router)

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'),() => {
    console.log("EL SERVIDOR SE ESTA EJECUTANDO EN EL PUERTO 3000");
})