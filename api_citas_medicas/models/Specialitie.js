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

/* console.log("Usuario Especialidad ID:", user.specialitieId);
console.log("Especialidad ID proporcionada:", specialitieId); */


export default Specialitie;
