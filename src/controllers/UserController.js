import { Op, QueryTypes, Sequelize } from "sequelize";
import sequelize from "../config/Database";
import roles from "../models/Roles";
import SendResponse from "../utils/responses/SendResponse";

const SUCCESS = 200;
const ERROR = 500;


export const userList = async (req, res, next) => {
  try {
    const users = await sequelize.query(
      ` 
      SELECT 
      u.id, 
      u.name,
      u.username,
      u.position, 
      r.role_name,
      u.phone_number,
      u.email
    FROM 
      medsavvy.users u,
    medsavvy.role_user_maps rum,
     medsavvy.roles r
    WHERE
 
      u.id = rum.user_id AND 
      r.id = rum.role_id
         
       `,
      {
        type: QueryTypes.SELECT,
      }
    );
    console.log(users)
    SendResponse(res, 'Success', users);
  } catch (error) {
    // sendSentryError(error, "assignVaToCampaign");
    return res.status(ERROR).json({ ques: [], message: error.message });
  }
}

export const getRoleList = async (req, res, next) => {
   
    try {
      const role_list = await roles.findAll({});
      SendResponse(res, 'Success', role_list);
    } catch (error) {
      // sendSentryError(error, "getConfig");
      next(error);
    }
  };


