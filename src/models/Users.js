import { DataTypes } from 'sequelize';
import sequelize from '../config/Database';

const { INTEGER, DATE } = DataTypes

const  users = sequelize.define(
  "users",
  {
    ID: {
      type: DataTypes.INTEGER,  // maps to INTEGER
      autoIncrement: true,      // automatically increment the value
      primaryKey: true,         // this is the table's primary key
      allowNull: false,         // value cannot be null
    },
    NAME: {
      type: DataTypes.STRING,   // maps to VARCHAR2
      allowNull: false,         // value cannot be null
    },
  },
  {
    schema: process.env.schema,
    timestamps: true,
  }
);

export default users;
