import { DataTypes, literal } from "sequelize";
import Sequelize from "../config/Database";

const { STRING, TEXT, INTEGER, ARRAY, BOOLEAN, DATE } = DataTypes;

const roles = Sequelize.define(
  "roles",
  {
    role_name: STRING,
    role_description: STRING,
    
    created_at: {
      type: "TIMESTAMP",
      defaultValue: literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "TIMESTAMP",
      defaultValue: literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    schema: process.env.schema,
  }
);

export default roles;