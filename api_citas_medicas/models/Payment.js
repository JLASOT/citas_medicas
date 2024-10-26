import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import Appointment from "./appointment";

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
    description:{
        type: DataTypes.STRING(250),
        allowNull: true
    },
    appointmentId: { // Clave foránea
        type: DataTypes.INTEGER,
        references: {
            model: 'Appointments', // Nombre de la tabla en plural
            key: 'id'
        },
        allowNull: false // Asegúrate de que cada tutor esté asociado a un paciente
    }

},{
    timestamps: true
});

Appointment.hasMany(Payment,{
    foreignKey: 'appointmentId',
    sourceKey: 'id'
});

Payment.belongsTo(Appointment,{
    foreignKey: 'appointmentId',
    targetKey: 'id'
})

export default Payment;