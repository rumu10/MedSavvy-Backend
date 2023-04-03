// import Questions from "../models/Questions";
// import Options from "../models/Options";
import { Op, QueryTypes, Sequelize } from "sequelize";
import sequelize from "../config/Database";
// import VaConfig from "../models/VaConfig";
// import VaConfigArchive from "../models/VaConfigArchive";
import SendResponse from "../utils/responses/SendResponse";
// import {
//   createQuestionValidation,
//   getQuestionValidation,
//   createOrUpdateConfigurationValidation,
//   getConfigValidation
// } from "../models/Validation";
// import moment from "moment";
// import VaCampaignAssignMaps from "../models/VaCamaignAssignMaps";
// import fs from 'fs';
// import csv from "csv-parser";
// import path from 'path';
// const __dirname = path.resolve();

const SUCCESS = 200;
const ERROR = 500;

// export const createQuestion = async (req, res, next) => {
//   // console.log(req.body);
//   const transaction = await sequelize.transaction();
//   try {
//     const { campaign, questions } = req.body;

//     await createQuestionValidation.validateAsync(req.body);

//     // Questions
//     for (let i = 0; i < questions.length; i++) {
//       const { id, isMulti, options, ques, weight, status } = questions[i];
//       if (status === "removed") {
//         await Questions.update(
//           {
//             is_deleted: 1,
//           },
//           {
//             where: {
//               id,
//             },
//           },
//           {
//             transaction: transaction,
//           }
//         );
//       } else if (status === "modify") {
//         let QusInfo = await Questions.update(
//           {
//             is_deleted: 1,
//           },
//           {
//             where: {
//               id,
//             },
//           },
//           {
//             transaction: transaction,
//           }
//         );

//         QusInfo = await Questions.create(
//           {
//             created_by: req.user.id,
//             campaign_id: campaign,
//             is_deleted: 0,
//             weight,
//             ques_text: ques,
//             isMultipleAns: isMulti,
//           },
//           {
//             transaction: transaction,
//           }
//         );

//         await ModifyOrCreateQusOptions(QusInfo.id, options, transaction);
//       } else if (status === "new") {
//         let QusInfo = await Questions.create(
//           {
//             created_by: req.user.id,
//             campaign_id: campaign,
//             is_deleted: 0,
//             weight,
//             ques_text: ques,
//             isMultipleAns: isMulti,
//           },
//           {
//             transaction: transaction,
//           }
//         );

//         await ModifyOrCreateQusOptions(QusInfo.id, options, transaction);
//       }
//     }
//     await transaction.commit();
//     res.status(200).json({ message: "Saved successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     sendSentryError(error, "CreateQues");
//     return res.status(ERROR).json({ message: error.message });
//   }
// };

// const ModifyOrCreateQusOptions = async (ques_id, options, transaction) => {
//   const bulkData = [];
//   for (let i = 0; i < options.length; i++) {
//     const { option, weight } = options[i];
//     bulkData.push({
//       ques_id,
//       option,
//       weight,
//     });
//   }

//   await Options.bulkCreate(bulkData, {
//     transaction: transaction,
//   });
// };

// export const getQuestion = async (req, res, next) => {
//   console.log("get", req.params);
//   try {
//     const { campaignID } = req.params;

//     await getQuestionValidation.validateAsync(req.params);

//     const ques = await Questions.findAll({
//       where: { campaign_id: campaignID, is_deleted: 0 },
//       include: [
//         {
//           attributes: ["id", "weight", "option"],
//           model: Options,
//           required: true,
//         },
//       ],
//     });
//     console.log("ques", ques);
//     res.status(200).json({ ques: ques, message: "fetch successfully" });
//   } catch (error) {
//     sendSentryError(error, "getQuestion");
//     return res.status(ERROR).json({ ques: [], message: error.message });
//   }
// };

// export const getActiveCampaign = async (req, res, next) => {
//   console.log("fff");
//   try {
//     const campaign = await sequelize.query(
//       ` 
//          select distinct c."name", c.id, c.version, c.to_date 
//          from ${process.env.test_schema}.campaigns c 
//          order by 
//          c.to_date desc
//        `,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );
//     // console.log(campaign);
//     res.status(200).json({ campaign: campaign, message: "fetch successfully" });
//   } catch (error) {
//     sendSentryError(error, "getQuestion");
//     return res.status(ERROR).json({ ques: [], message: error.message });
//   }
// };

// export const createOrUpdateConfiguration = async (req, res, next) => {
//   console.log(req.body);
//   const transaction = await sequelize.transaction();
//   try {
//     const {
//       campaign_id,
//       va_target,
//       va_sup_target,
//       per_br_audio,
//       per_va_count_for_vasup,
//       over_achieve_switch,
//       module_switch,
//       activate,
//       audio_per_load
//     } = req.body;

//     await createOrUpdateConfigurationValidation.validateAsync(req.body);

//     const VersionInfo = await GetOldVersionInfo(campaign_id);
//     if (VersionInfo) {
//       await VaConfig.update(
//         {
//           va_target,
//           va_sup_target,
//           per_br_audio,
//           per_va_count_for_vasup,
//           over_achieve_switch,
//           module_switch,
//           activate,
//           audio_per_load,
//           version: VersionInfo + 1,
//         },
//         {
//           where: {
//             campaign_id
//           }
//         },
//         {
//           transaction: transaction,
//         }
//       );
//     } else {
//       await VaConfig.create(
//         {
//           campaign_id,
//           va_target,
//           va_sup_target,
//           per_br_audio,
//           per_va_count_for_vasup,
//           over_achieve_switch,
//           module_switch,
//           activate,
//           audio_per_load,
//           version: 1,
//         },
//         {
//           transaction: transaction,
//         }
//       );
//     }

//     await StoreVaConfigArchive(req.body, VersionInfo, transaction);
//     await transaction.commit();

//     SendResponse(res, `Config ${VersionInfo ? "modified" : "created"} successfully`, [])
//   } catch (error) {
//     await transaction.rollback();
//     console.log(error);
//     return next(error);
//   }
// };

// const StoreVaConfigArchive = async (data, VersionInfo, transaction) => {
//   const {
//     campaign_id,
//     va_target,
//     va_sup_target,
//     per_br_audio,
//     per_va_count_for_vasup,
//     over_achieve_switch,
//     module_switch,
//     activate,
//     audio_per_load
//   } = data;

//   await VaConfigArchive.create(
//     {
//       campaign_id,
//       va_target,
//       va_sup_target,
//       per_br_audio,
//       per_va_count_for_vasup,
//       over_achieve_switch,
//       module_switch,
//       activate,
//       audio_per_load,
//       version: VersionInfo + 1,
//     },
//     {
//       transaction: transaction,
//     }
//   );
// };

// const GetOldVersionInfo = async (campaign_id) => {
//   const VersionInfo = await VaConfigArchive.count({
//     where: {
//       campaign_id,
//     },
//   });
//   return VersionInfo;
// };

// export const getConfiguration = async (req, res, next) => {
//   await getConfigValidation.validateAsync(req.params);
//   try {
//     const config = await VaConfig.findOne({
//       where: {
//         campaign_id: req.params.campaignID
//       },
//     });
//     SendResponse(res, 'Success', config);
//   } catch (error) {
//     // sendSentryError(error, "getConfig");
//     next(error);
//   }
// };

// export const getVaList = async (req, res, next) => {
//   try {
//     let valist = await sequelize.query(
//       `
//       select rlm.assigned_to as id, u.uid, ui.full_name, r.name as role, r.va
//         from 
//         ${process.env.test_schema}.role_location_maps rlm,
//         ${process.env.test_schema}.users u,
//         ${process.env.test_schema}.user_infos ui,
//         ${process.env.test_schema}.roles r
//         where 
//         r.id = rlm.assigned_role  
//         and u.id = ui.user_id
//         and r.va like '%22%'
//         and rlm.assigned_to = u.id
//         and u.stts = 1 
//         --and u.id not in (select user_id from  ${process.env.va_schema}.va_campaign_assign_maps vcam)
//     `,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );

//     let va_sup_list = await sequelize.query(
//       `
//       select rlm.assigned_to as id, u.uid, ui.full_name, r.name as role
//         from 
//         ${process.env.test_schema}.role_location_maps rlm,
//         ${process.env.test_schema}.users u,
//         ${process.env.test_schema}.user_infos ui,
//         ${process.env.test_schema}.roles r
//         where 
//         r.id = rlm.assigned_role  
//         and u.id = ui.user_id
//         and r.va like '%23%'
//         and rlm.assigned_to = u.id
//         and u.stts = 1
//         --and u.id not in (select user_id from  ${process.env.va_schema}.va_campaign_assign_maps vcam)
//     `,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );

//     let assigned_list = await sequelize.query(


//       `
//       select rlm.assigned_to as id, u.uid, ui.full_name, r.name as role
//         from 
//         ${process.env.test_schema}.role_location_maps rlm,
//         ${process.env.test_schema}.users u,
//         ${process.env.test_schema}.user_infos ui,
//         ${process.env.test_schema}.roles r,
//         ${process.env.va_schema}.va_campaign_assign_maps vcam
//         where 
//         r.id = rlm.assigned_role
//         and u.id = vcam.user_id
//         and u.id = ui.user_id
//         and rlm.assigned_to = u.id
//         and u.stts = 1
//         and vcam.campaign_id = ${req.body.campaign_id}
//         and vcam.is_deleted = 0
//     `,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );

//     res.status(200).json({ valist: valist, va_sup_list: va_sup_list, assigned_list: assigned_list, message: "fetch successfully" });
//   } catch (error) {
//     if (process.env.STAGE !== "Development" && !error.flag) {
//       Sentry.captureException(`error: ${error} || function:getVaList`);
//     }
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     next(error);
//   }
// };

// export const getAdminVaList = async (req, res, next) => {
//   try {
//     let valist = await sequelize.query(
//       `
//       select rlm.assigned_to as id, u.uid, ui.full_name, r.name as role, r.va
//         from 
//         ${process.env.test_schema}.role_location_maps rlm,
//         ${process.env.test_schema}.users u,
//         ${process.env.test_schema}.user_infos ui,
//         ${process.env.test_schema}.roles r
//         where 
//         r.id = rlm.assigned_role  
//         and u.id = ui.user_id
//         and r.va like '%22%'
//         and rlm.assigned_to = u.id
//         and u.stts = 1
//         --and u.id not in (select user_id from  ${process.env.va_schema}.va_campaign_assign_maps vcam)
//     `,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );

//     res.status(200).json({ valist: valist, message: "fetch successfully" });
//   } catch (error) {
//     if (process.env.STAGE !== "Development" && !error.flag) {
//       Sentry.captureException(`error: ${error} || function:getVaList`);
//     }
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     next(error);
//   }
// };

// export const assignVaToCampaign = async (req, res, next) => {
//   // console.log("fff", req.body);
//   let bulkData = [];
//   for (const iterator of req.body.va) {
//     bulkData.push({
//       user_id: iterator.id,
//       campaign_id: +req.body.campaign_id,
//       assigned_by: req.user.id,
//       assign_date: moment().format('YYYY-MM-DD')
//     })
//   }
//   // console.log(bulkData);
//   try {
//     await VaCampaignAssignMaps.bulkCreate(bulkData);
//     SendResponse(res, 'Success', [])
//   } catch (error) {
//     // sendSentryError(error, "assignVaToCampaign");
//     return res.status(ERROR).json({ ques: [], message: error.message });
//   }
// };

// export const deleteVaFromCampaign = async (req, res) => {
//   const { VAId, campaignId } = req.body;
//   try {
//     const deleteData = await VaCampaignAssignMaps.update({ is_deleted: 1 }, {
//       where: {
//         [Op.and]: [
//           { user_id: VAId },
//           { campaign_id: +campaignId }
//         ]
//       },
//     })
//     if (deleteData[0]) {
//       res.status(200).send({ message: "success", "user_id": VAId, "campaign_id": campaignId })
//     } else {
//       res.status(ERROR).json({ message: "VA not removed !" });
//     }

//   } catch (error) {
//     return res.status(ERROR).json({ message: error.message });
//   }
// }



// export const getCampaignName = async (req, res, next) => {
//   try {
//     const campaign = await sequelize.query(
//       ` 
//          select c."name"
//          from ${process.env.test_schema}.campaigns c 
//           where id = ${req.body.campaign_id}
//        `,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );
//     SendResponse(res, 'Success', campaign);
//   } catch (error) {
//     // sendSentryError(error, "assignVaToCampaign");
//     return res.status(ERROR).json({ ques: [], message: error.message });
//   }
// };

// export const bulkAssignVa = async (req, res) => {
//   console.log('body',req.file, req.params.id);
//   try {
//   const file_path = `${Math.floor(100000 + Math.random() * 900000)}.csv`;
//   fs.writeFileSync(file_path, req.file.buffer)

//   const data = [];
//   fs.createReadStream(file_path)
//   .pipe(csv())
//   .on('data', (row) => {
//     data.push(row.UID);
//   })
//   .on('end', async() => {
//     console.log('CSV file successfully processed');
//     const uid = data.map(v => `'${v}'`)
//     const users = await sequelize.query(
//       ` 
//          select u.id
//          from ${process.env.test_schema}.users u
//           where u.uid in (${uid.join(',')})
//        `,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );
//     const uids = users.map(v => v.id);
//     // console.log(uids);
//     const existing_user = await sequelize.query(
//       ` 
//          select user_id
//          from ${process.env.va_schema}.va_campaign_assign_maps
//           where user_id in (${uids.join(',')}) and campaign_id = ${req.params.id} and is_deleted = 0
//        `,
//       {
//         type: QueryTypes.SELECT,
//       }
//     );
//     const match = existing_user.map( v => v.user_id);
//     const to_assign = uids.filter(f => !match.includes(f));

//     console.log('asssign',to_assign);

//     if(to_assign.length == 0) {
//       SendResponse(res, 'Already Assigned', [])
//     } else {
//       try {
//         let bulkData = [];
//         for (const iterator of to_assign) {
//           bulkData.push({
//             user_id: iterator,
//             campaign_id: +req.params.id,
//             assigned_by: req.user.id,
//             assign_date: moment().format('YYYY-MM-DD')
//           })
//         }
//       await VaCampaignAssignMaps.bulkCreate(bulkData);
//       SendResponse(res, 'Success', [])
//     } catch (error) {
//       return res.status(ERROR).json({ ques: [], message: error.message });
//     }
//     }

//     fs.unlinkSync(file_path);
//   });
//   } catch (error) {
//     console.log(error);
//   }
// };

export const userList = async (req, res, next) => {
  try {
    const users = await sequelize.query(
      ` 
         select *
         from ${process.env.schema}.users ;
         
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
