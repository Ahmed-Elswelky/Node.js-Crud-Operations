const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const roleNames = require("../utils/roleNames");

const Course = sequelize.define(
    "Course",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            require: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            require: true,
        },
    },
    {
        tableName: "courses",
        timestamps: false, // Disable timestamps if not needed
    }
);

module.exports = Course;