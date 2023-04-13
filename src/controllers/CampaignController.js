import { Op, QueryTypes, Sequelize } from "sequelize";
import bcrypt from 'bcryptjs';
import sequelize from "../config/Database";
import roles from "../models/Roles";
import users from "../models/Users";
import SendResponse from "../utils/responses/SendResponse";
import RoleuserMaps from "../models/RoleUserMaps";
import campType from "../models/campType";
import campTypeMaps from "../models/camp_type_maps";
import campaigns from "../models/Campaign";
import Questions from "../models/questions";
import Options from "../models/options";

const SUCCESS = 200;
const ERROR = 500;


export const campaignList = async (req, res, next) => {
  try {
    const camps = await sequelize.query(
      ` 
      SELECT 
      c.*, ct.type_name 
     FROM 
       medsavvy.campaigns c,
       medsavvy.camp_type_maps ctm,
       medsavvy.camp_types ct 
       where 
       c.id = ctm.cam_id 
       and ct.id = ctm.type_id 
       and c.delete_marker = false
         
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
    const role_list = await campType.findAll({});
    SendResponse(res, 'Success', role_list);
  } catch (error) {
    // sendSentryError(error, "getConfig");
    next(error);
  }
};


export const createCampaign = async (req, res, next) => {
  const { camp_name, end_date, start_date, survey_target, type } =
    req.body;

  const transaction = await sequelize.transaction();
  try {
    const user = await campaigns.create({
      camp_name,
      end_date,
      start_date,
      survey_target
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
    const roleuser = await campTypeMaps.create({
      cam_id: user.id,
      type_id: type

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
    const user = await campaigns.update({
      delete_marker: true
    },
      {
        where: { id: id }
      },
      {
        transaction: transaction,
      }
    );

    // const roleuser = await RoleuserMaps.destroy({
    //   where: { user_id: id },
    //   transaction: transaction,
    // });

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

export const getQuestion = async (req, res, next) => {
  console.log("get", req.params);
  try {
    const { campaignID } = req.params;

    const ques = await Questions.findAll({
      where: { camp_id: campaignID, is_deleted: 0 },
      include: [
        {
          attributes: ["id", "option_text"],
          model: Options,
          required: true,
        },
      ],
    });
    return SendResponse(res, "Successful", ques);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const createQuestion = async (req, res, next) => {
  // console.log(req.body);
  const transaction = await sequelize.transaction();
  try {
    const { campaign, questions } = req.body;

    // Questions
    for (let i = 0; i < questions.length; i++) {
      const { id, isMulti, options, ques, status } = questions[i];
      if (status === "removed") {
        await Questions.update(
          {
            is_deleted: 1,
          },
          {
            where: {
              id,
            },
          },
          {
            transaction: transaction,
          }
        );
      } else if (status === "modify") {
        let QusInfo = await Questions.update(
          {
            is_deleted: 1,
          },
          {
            where: {
              id,
            },
          },
          {
            transaction: transaction,
          }
        );

        QusInfo = await Questions.create(
          {
            camp_id: campaign,
            is_deleted: 0,
            q_text: ques,
            isMultipleAns: isMulti,
          },
          {
            transaction: transaction,
          }
        );

        await ModifyOrCreateQusOptions(QusInfo.id, options, transaction);
      } else if (status === "new") {
        let QusInfo = await Questions.create(
          {
            camp_id: campaign,
            is_deleted: 0,
            q_text: ques,
            isMultipleAns: isMulti,
          },
          {
            transaction: transaction,
          }
        );

        await ModifyOrCreateQusOptions(QusInfo.id, options, transaction);
      }
    }
    await transaction.commit();
    res.status(200).json({ message: "Saved successfully" });
  } catch (error) {
    console.log(error)
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};

const ModifyOrCreateQusOptions = async (ques_id, options, transaction) => {
  const bulkData = [];
  for (let i = 0; i < options.length; i++) {
    const { option } = options[i];
    bulkData.push({
      quest_id: ques_id,
      option_text: option,
    });
  }

  await Options.bulkCreate(bulkData, {
    transaction: transaction,
  });
};

