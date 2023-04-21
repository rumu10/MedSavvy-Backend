import { Op, QueryTypes, Sequelize } from "sequelize";
import bcrypt from 'bcryptjs';
import sequelize from "../config/Database";
import roles from "../models/Roles";
import users from "../models/Users";
import SendResponse from "../utils/responses/SendResponse";
import RoleuserMaps from "../models/RoleUserMaps";
import Permission from "../models/Permission";
import RolePermissionMaps from "../models/RolePermissionMaps";

const SUCCESS = 200;
const ERROR = 500;


export const AgeofCustomers = async (req, res, next) => {
  try {
    const users = await sequelize.query(
      ` 
      SELECT
      count(*) as customer_age_count,
   
        case
           WHEN c.customer_age <21 THEN 'Less than 20'
           WHEN c.customer_age BETWEEN 21 AND 30 THEN '21-30'
           WHEN c.customer_age BETWEEN 31 AND 40 THEN '31-40'
           WHEN c.customer_age BETWEEN 41 AND 50 THEN '41-50'
           WHEN c.customer_age > 50 THEN 'More than 50'
          
        end AS Age
        FROM medsavvy.customers c , medsavvy.campaigns camp
        where camp.id = ${req.body.camp_id} and c.camp_id = camp.id 
        group by Age
        order by Age;
         
       `,
      {
        type: QueryTypes.SELECT,
      }
    );
    SendResponse(res, 'Success', users);
  } catch (error) {
    // sendSentryError(error, "assignVaToCampaign");
    return res.status(ERROR).json({ ques: [], message: error.message });
  }
}
