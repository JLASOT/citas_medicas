import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from './User'; // Importar el modelo User
import Day from './Day'; // Importar el modelo Day
import Hour from './Hour'; // Importar el modelo Hour

const DayHour = sequelize.define('DayHour', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // Autoincremental
        primaryKey: true, // Clave primaria
        allowNull: false
    },
    userId: { // Clave foránea para User
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Nombre de la tabla Users
            key: 'id'
        },
        allowNull: false
    },
    dayId: { // Clave foránea para Day
        type: DataTypes.INTEGER,
        references: {
            model: 'Days', // Nombre de la tabla Days
            key: 'id'
        },
        allowNull: false
    },
    hourId: { // Clave foránea para Hour
        type: DataTypes.INTEGER,
        references: {
            model: 'Hours', // Nombre de la tabla Hours
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

User.hasMany(DayHour, { foreignKey: 'userId' });
DayHour.belongsTo(User, { foreignKey: 'userId' });

Day.hasMany(DayHour, { foreignKey: 'dayId' });
DayHour.belongsTo(Day, { foreignKey: 'dayId' });

Hour.hasMany(DayHour, { foreignKey: 'hourId' });
DayHour.belongsTo(Hour, { foreignKey: 'hourId' });

export default DayHour;
