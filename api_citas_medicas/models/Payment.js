import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Payment = sequelize.define('Payment',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    monto :{
        type : DataTypes.FLOAT,
        allowNull: false
    },
    metodoPago : {
        type : DataTypes.STRING(100),
        allowNull: false
    },
    
   /*  patientId: { // Clave foránea
        type: DataTypes.INTEGER,
        references: {
            model: 'Patients', // Nombre de la tabla en plural
            key: 'id'
        },
        allowNull: false // Asegúrate de que cada tutor esté asociado a un paciente
    } */

},{
    timestamps: true
});


export default Payment;