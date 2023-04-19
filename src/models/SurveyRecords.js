import { DataTypes, literal } from "sequelize";
import Sequelize from "../config/Database";

const { STRING, TEXT, INTEGER, ARRAY, BOOLEAN, DATE } = DataTypes;

const SurveyRecords = Sequelize.define(
  "survey_records",
  {
    customer_id: INTEGER,
    ques_id: INTEGER,
    ans: STRING,
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
    schema: process.env.schema,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default SurveyRecords;
