import { DataTypes, literal } from "sequelize";
import Sequelize from "../config/Database";
import Options from "./options";

const { STRING, TEXT, INTEGER, ARRAY, BOOLEAN, DATE } = DataTypes;

const Questions = Sequelize.define('questions', {
  "q_text": STRING,
  "camp_id": INTEGER,
  isMultipleAns: INTEGER,
  is_deleted: INTEGER,
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

Questions.hasMany(Options, { foreignKey: "quest_id" });

export default Questions;