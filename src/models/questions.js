import { DataTypes, literal } from "sequelize";
import Sequelize from "../config/Database";

const { STRING, TEXT, INTEGER, ARRAY, BOOLEAN, DATE } = DataTypes;

const questions = Sequelize.define('questions', {
  "q_text": STRING,
  "camp_id": INTEGER,
  
  // "active": BOOLEAN,
  // "delete_marker": BOOLEAN,
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
});

export default questions;