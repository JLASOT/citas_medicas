import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

const Specialitie = sequelize.define('Specialitie',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    price : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    description:{
        type: DataTypes.STRING(250),
        allowNull: true
    }
},{
    timestamps: true
});

Specialitie.hasMany(User,{
    foreignKey: 'specialitieId',
    sourceKey: 'id'
});

User.belongsTo(Specialitie,{
    foreignKey: 'specialitieId',
    targetKey: 'id'
});

export default Specialitie;
