// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class user extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   user.init({
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password: DataTypes.STRING,
//     role: DataTypes.STRING,
//     address: DataTypes.STRING,
//     phone: DataTypes.STRING,
//     gender: DataTypes.STRING,
//     image: DataTypes.JSON,
//     activationToken: DataTypes.STRING,
//     forgetPassword: DataTypes.STRING,
//     expiryTime: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'user',
//   });
//   return user;
// };
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/pg.config");
const UserModel = sequelize.define("users", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM,
        values: ["admin", "seller", "customer"],
        defaultValue: "customer",
    },
    address: {
        type: DataTypes.STRING,
    },
    phone: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    gender: {
        type: DataTypes.ENUM,
        values: ["Male", "Female", "others"],
    },
    image: {
        type: DataTypes.JSON,
    },
    activationToken: {
        type: DataTypes.STRING,
    },
    forgetPassword: {
        type: DataTypes.STRING,
    },
    expiryTime: {
        type: DataTypes.DATE,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now(),
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now(),
    },
    forgetPasswordToken:{
        type:DataTypes.STRING
    }
});
module.exports = UserModel;
