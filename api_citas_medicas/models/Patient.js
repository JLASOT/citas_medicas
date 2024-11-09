import {DataTypes} from 'sequelize';
import sequelize from '../config/database';
import Tutor from './Tutor'

const Patient = sequelize.define('Patient',{
    name :{
        type : DataTypes.STRING(30),
        allowNull: false
    },
    surname : {
        type : DataTypes.STRING(50),
        allowNull: false
    },
    ci :{
        type : DataTypes.INTEGER,
        allowNull: false,
        unique : true
    },
    email : {
        type : DataTypes.STRING(30),
        allowNull: true
    },
    phone : {
        type : DataTypes.STRING(30),
        allowNull: true
    },
    edad : {
        type : DataTypes.INTEGER,
        allowNull: false
    },
    antecedent_allergic : {
        type : DataTypes.STRING(250),
        allowNull : true
    },
    antecedent_family : {
        type : DataTypes.STRING(250),
        allowNull : true
    },
    antecedent_personal : {
        type : DataTypes.STRING(250),
        allowNull : true
    },
    blood_type : {
        type : DataTypes.STRING(10),
        allowNull : false
    },
    temperature : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    talla : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    peso : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    fc : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    pa : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    gender : {  //M masculino F femenino
        type : DataTypes.CHAR(1),
        allowNull : false
    },
    addres : {
        type : DataTypes.STRING(250),
        allowNull : true
    },
    state : {
        type : DataTypes.INTEGER,
        defaultValue : 1
    }
},{
    timestamps : true
});

Patient.hasMany(Tutor,{
    foreignKey: 'patientId',
    sourceKey: 'id',
    as: 'tutors'
})

Tutor.belongsTo(Patient,{
    foreignKey: 'patientId',
    targetKey: 'id'
})


export default Patient;