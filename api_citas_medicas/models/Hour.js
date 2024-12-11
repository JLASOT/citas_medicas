import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Hour =sequelize.define('Hour',{
    name: {
        type: DataTypes.TIME,
        allowNull: false,
        unique: true
    },
}, {
        timestamps: true
    }
);

export default Hour;