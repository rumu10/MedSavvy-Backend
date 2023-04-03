import bcrypt from "bcryptjs";
import { equal } from "joi";
import { QueryTypes, Op } from "sequelize";
import db from "../config/Database";
import CreateJWT from "../utils/CreateJWT";
import SendResponse from "../utils/responses/SendResponse";



export const SignInWeb = async (req, res, next) => {
  const { user_name, password } = req.body;

  if (!user_name) {
    const error = new Error("Provide your username");
    error.statusCode = 404;
    error.flag = true;
    return next(error);
  }

  if (!password) {
    const error = new Error("Provide your password");
    error.statusCode = 404;
    error.flag = true;
    return next(error);
  }


  // get user information
  const UserInfo = await db.query(
    `
    SELECT 
    u.id, 
    u.name,
    u.username,
    u.position, 
    u."pass", 
    r.role_name,
    r.id as role_id,
    array_agg( rpm.permission_id ) as permission_list
  FROM 
    medsavvy.users u,
  medsavvy.role_user_maps rum,
   medsavvy.roles r,
   medsavvy.role_permission_maps rpm 
  WHERE
    u.username = '${user_name}' AND 
    u.id = rum.user_id AND 
    r.id = rum.role_id
    and r.id = rpm.role_id 
    group by 
    u.id,
    r.id,
    u.name,
    u.username,
    u.position, 
    u."pass", 
    r.role_name
    `,
    {
      type: QueryTypes.SELECT,
    }
  );

  if (!UserInfo.length) {
    const error = new Error("User not found!");
    error.statusCode = 404;
    error.flag = true;
    return next(error);
  }

  const {
    id,
    position,
    role_name,
    username,
    permission_list,
    role_id
  } = UserInfo[0];

  const isEqual = await bcrypt.compare(password, UserInfo[0].pass);
  console.log(isEqual);

  if(isEqual){
    req.user = {
      id,
      username,
      role_id,
    };


    SendResponse(res, "Succes", {
      token: CreateJWT(req.user),
      user_id: id,
      position,
      role_name,
      username,
      permission_list,
      role_id
    });
  } else {
    console.log('incorect')
    const error = new Error("Password is incorrect!");
    error.statusCode = 404;
    error.flag = true;
    return next(error);
  }

  
};

