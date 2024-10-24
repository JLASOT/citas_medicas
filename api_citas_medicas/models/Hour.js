import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Hour =sequelize.define('Hour',{
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
        timestamps: true
    }
);

export default Hour;