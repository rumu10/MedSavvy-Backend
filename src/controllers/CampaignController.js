import { Op, QueryTypes, Sequelize } from "sequelize";
import bcrypt from 'bcryptjs';
import sequelize from "../config/Database";
import roles from "../models/Roles";
import users from "../models/Users";
import SendResponse from "../utils/responses/SendResponse";
import RoleuserMaps from "../models/RoleUserMaps";

const SUCCESS = 200;
const ERROR = 500;


export const campaignList = async (req, res, next) => {
  try {
    const camps = await sequelize.query(
      ` 
      SELECT 
     *
    FROM 
      medsavvy.campaigns
         
       `,
      {
        type: QueryTypes.SELECT,
      }
    );
    console.log(camps)
    SendResponse(res, 'Success', camps);
  } catch (error) {
    // sendSentryError(error, "assignVaToCampaign");
    return res.status(ERROR).json({ ques: [], message: error.message });
  }
}

export const getTypeList = async (req, res, next) => {

  try {
    const role_list = await roles.findAll({});
    SendResponse(res, 'Success', role_list);
  } catch (error) {
    // sendSentryError(error, "getConfig");
    next(error);
  }
};


export const createCampaign = async (req, res, next) => {
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


export const deleteCampaign = async (req, res, next) => {
  console.log(req.body)
  const id = req.body.id;
  const transaction = await sequelize.transaction();
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

