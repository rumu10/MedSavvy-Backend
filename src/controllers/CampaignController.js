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
import customers from "../models/customer";
import SurveyRecords from "../models/SurveyRecords";

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

export const getSpList = async (req, res, next) => {
  try {
    let valist = await sequelize.query(
      `
      SELECT 
      u.id, 
      u.name,
      u.username,
      u.position, 
      r.id role_id,
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
      u.delete_marker = false and 
      r.id= 2
    `,
      {
        type: QueryTypes.SELECT,
      }
    );

    let assigned_list = await sequelize.query(

      `
         SELECT 
         u.id, 
         u.name,
         u.username,
         c.camp_name 
       FROM 
         medsavvy.users u,
       medsavvy.camp_user_maps cum, 
       medsavvy.campaigns c 
       WHERE
    
         u.id = cum.user_id AND 
         c.id = cum.camp_id and
          c.id = ${req.body.campaign_id} and
         u.delete_marker = false
      
    `,
      {
        type: QueryTypes.SELECT,
      }
    );
    return SendResponse(res, "Successful", { valist: valist, assigned_list: assigned_list });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const getAssignedCampaigns = async (req, res, next) => {
  try {
    const camps = await sequelize.query(
      `
      select cum.*, c.camp_name 
      from 
      medsavvy.camp_user_maps cum  ,
    medsavvy.campaigns c 
      where 
    	c.id = cum.camp_id 
    	and cum.user_id = ${req.body.user_id}
        `, { type: QueryTypes.SELECT }
    );
    SendResponse(res, 'Success', camps);

  } catch (error) {
    console.log(error);
  }

}

export const getSurveyQuestions = async (req, res, next) => {
  try {
    const camps = await Questions.findAll({
      where: { camp_id: req.body.campaign_id,is_deleted: 0  },
      include: [
        {
          model: Options,
          required: true,
        }
      ],
    })
    SendResponse(res, 'Success', camps);

  } catch (error) {
    console.log(error);
  }

}

export const getCampaignName = async (req, res, next) => {
  try {
    const campaign = await sequelize.query(
      ` 
         select c."camp_name"
         from medsavvy.campaigns c 
          where id = ${req.body.campaign_id}
       `,
      {
        type: QueryTypes.SELECT,
      }
    );
    SendResponse(res, 'Success', campaign);
  } catch (error) {
    // sendSentryError(error, "assignVaToCampaign");
    return res.status(ERROR).json({ ques: [], message: error.message });
  }
};

export const saveSurvey = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {

    const customer = await customers.create(
      {
        customer_name: req.body.customer_name,
        survey_date: req.body.date,
        customer_age: req.body.customer_age,
        profession: req.body.profession,
        email: req.body.email,
        survey_by: req.body.survey_by,
        camp_id: req.body.campaign
      },
      {
        transaction: transaction
      }
    );
  const ansArr= req.body.ansArr;
    const bulkData = [];
    for (let i = 0; i < ansArr.length; i++) {
      console.log(ansArr[i])
      bulkData.push({
        customer_id: customer.id,
        ques_id: ansArr[i].ques_id,
        ans:ansArr[i].ans
      });
    }
    console.log(bulkData)
    await SurveyRecords.bulkCreate(bulkData, {
      transaction: transaction,
    });

    await transaction.commit();
    SendResponse(res, 'Success', "saved");
  } catch (error) {
    console.log(error)
    await transaction.rollback();
    return res.status(ERROR).json({ ques: [], message: error.message });
  }
};

export const ByUserSurveyCount = async (req, res, next) => {
  try {
    const campaign = await sequelize.query(
      ` 
      select count(*) 
      from 
      medsavvy.customers c 
      where 
      c.survey_by = ${req.body.user_id}
      and c.camp_id = ${req.body.campaign_id}
       `,
      {
        type: QueryTypes.SELECT,
      }
    );
    SendResponse(res, 'Success', campaign);
  } catch (error) {
    // sendSentryError(error, "assignVaToCampaign");
    return res.status(ERROR).json({ ques: [], message: error.message });
  }
};