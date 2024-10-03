import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const User = sequelize.define('User', {
    rol: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(250),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    state: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    phone: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    birthday: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    is_instructor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    profession: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

export default User;
