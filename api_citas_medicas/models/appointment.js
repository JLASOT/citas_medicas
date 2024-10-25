import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from './User';
import Specialitie from './Specialitie';
import DayHour from './DayHour';
import Patient from './Patient';


const Appointment = sequelize.define('Appointment',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    dateAppointment:{
        type: DataTypes.STRING(20),
        allowNull: false
    },
    patientId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'patients',
            key: 'id'
        },
    },
    specialitieId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'specialities',
            key: 'id'
        }
    },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'users',
            key: 'id'
        }
    },
    dayHourId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'dayhours',
            key: 'id'
        }
    }
},{
    timestamps: true
});


Patient.hasMany(Appointment, { 
    foreignKey: 'patientId',
    sourceKey: 'id'
});
Appointment.belongsTo(Patient, { 
    foreignKey: 'patientId' ,
    targetKey: 'id'
});

User.hasMany(Appointment, { 
    foreignKey: 'userId',
    sourceKey: 'id'
});
Appointment.belongsTo(User, { 
    foreignKey: 'userId' ,
    targetKey: 'id'
});


Specialitie.hasMany(Appointment, { 
    foreignKey: 'specialitieId',
    sourceKey: 'id'
});
Appointment.belongsTo(Specialitie, { 
    foreignKey: 'specialitieId' ,
    targetKey: 'id'
});


DayHour.hasMany(Appointment, { 
    foreignKey: 'dayHourId',
    sourceKey: 'id'
});
Appointment.belongsTo(DayHour, { 
    foreignKey: 'dayHourId' ,
    targetKey: 'id'
});

export default Appointment;