import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Tutor = sequelize.define('Tutor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    ci: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    relationship: {
        type: DataTypes.STRING(50), // Puedes ajustar la longitud según sea necesario 
        allowNull: false 
    },
    patientId: { // Clave foránea
        type: DataTypes.INTEGER,
        references: {
            model: 'Patients', // Nombre de la tabla en plural
            key: 'id'
        },
        allowNull: false // Asegúrate de que cada tutor esté asociado a un paciente
    }

}, {
    timestamps: true
});


export default Tutor;