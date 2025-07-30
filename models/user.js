const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const roleNames = require("../utils/roleNames");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    second_name: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      require: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      require: true,
    },
    role: {
      type: DataTypes.STRING,
      Enum: [roleNames.USER, roleNames.ADMIN, roleNames.MANAGER, roleNames.GUEST],
      defaultValue: roleNames.USER,
    },
    profile_picture: {
      type: DataTypes.STRING,
      defaultValue: "default.png",
    },
  },
  {
    tableName: "newUsers",
    timestamps: false,
  }
);

// User.sync()
//   .then(() => {
//     console.log("User table created (if it didn't exist).");
//   })
//   .catch((err) => {
//     console.error("Error creating User table:", err);
//   });


module.exports = User;
