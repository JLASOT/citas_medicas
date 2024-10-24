// models/Day.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database';


const Day = sequelize.define('Day', {
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
}, {
    timestamps: true // Si no necesitas createdAt y updatedAt, puedes agregar { timestamps: false }
});

export default Day;
