import { DataTypes, literal } from "sequelize";
import Sequelize from "../config/Database";

const { STRING, TEXT, INTEGER, ARRAY, BOOLEAN, DATE ,FLOAT } = DataTypes;

const products = Sequelize.define('products', {
  "prod_name": STRING,
  "prod_category": STRING,
  "price": FLOAT,
 
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

export default products;