import { DataTypes, literal } from "sequelize";
import Sequelize from "../config/Database";

const { STRING, TEXT, INTEGER, ARRAY, BOOLEAN, DATE } = DataTypes;

const campaigns = Sequelize.define(
  "campaign",
  {
    camp_name: STRING,
    camp_type: STRING,
    start_date: Date,
    end_date: Date,
    
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

export default campaigns;