import { Op, QueryTypes, Sequelize } from "sequelize";
import bcrypt from 'bcryptjs';
import sequelize from "../config/Database";
import roles from "../models/Roles";
import users from "../models/Users";
import SendResponse from "../utils/responses/SendResponse";
import RoleuserMaps from "../models/RoleUserMaps";

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
      r.id = rum.role_id AND
      u.delete_marker = false
         
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


export const createUser = async (req, res, next) => {
  const { name, email, username, phone_number, position, role_id, pass } =
    req.body;
  var salt = bcrypt.genSaltSync(10);
  var hashpass = bcrypt.hashSync(pass, salt);
  const transaction = await sequelize.transaction();
  console.log(hashpass)
  try {
    const user = await users.create({
      name,
      username,
      position,
      email,
      phone_number,
      pass: hashpass
    },
      {
        transaction: transaction,
      }
    );

    if (!user) {
      const error = new Error("Not Created!!");
      error.flag = true;
      error.statusCode = 404;
      error.data = null;
      throw error;
    }
    console.log(user.id)
    const roleuser = await RoleuserMaps.create({
      role_id,
      user_id: user.id

    },
      {
        transaction: transaction,
      }
    );


    await transaction.commit();
    return SendResponse(res, "Successful", user);
  } catch (error) {
    console.log(error)
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  const id = req.body.id;
  const transaction = await sequelize.transaction();
  console.log(id)
  try {
    const user = await users.update({
      delete_marker: true
    },
      {
        where: { id: id }
      },
      {
        transaction: transaction,
      }
    );

    const roleuser = await RoleuserMaps.destroy({
      where: { user_id: id },
      transaction: transaction,
    });

    await transaction.commit();
    return SendResponse(res, "Successful", user);
  } catch (error) {
    console.log(error)
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { name, email, username, phone_number, position, role_id } =
    req.body;
    console.log(req.body)
  const transaction = await sequelize.transaction();
  try {
    const user = await users.update({
      name,
      username,
      position,
      email,
      phone_number
    },
    {
      where: { id: +req.body.id }
    },
      {
        transaction: transaction,
      }
    );

    const roleuser = await RoleuserMaps.update({
      role_id,
    },
    {
      where: { user_id: +req.body.id }
    },
      {
        transaction: transaction,
      }
    );


    await transaction.commit();
    return SendResponse(res, "Successful", user);
  } catch (error) {
    console.log(error)
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await sequelize.query(
      ` 
      SELECT 
      u.id, 
      u.name,
      u.username,
      u.position, 
      r.role_name,
      r.id role_id,
      u.phone_number,
      u.email
    FROM 
      medsavvy.users u,
    medsavvy.role_user_maps rum,
     medsavvy.roles r
    WHERE
 
      u.id = rum.user_id AND 
      r.id = rum.role_id AND
      u.delete_marker = false and
      u.id =${req.params.id}
         
       `,
      {
        type: QueryTypes.SELECT,
      }
    );
    SendResponse(res, 'Success', user);
  } catch (error) {
    console.log(error)
    next(error);
  }
};

