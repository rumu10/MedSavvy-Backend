import { Router } from "express";
import { ByUserSurveyCount, campaignList, createCampaign, createQuestion, deleteCampaign, getAssignedCampaigns, getCampaignName, getQuestion, getSpList, getSurveyQuestions, getTypeList, saveSurvey } from "../controllers/CampaignController";
import { updateCampaign } from "../controllers/UserController";
import AuthorizedUser from "../middlewares/AuthorizedUser";


const router = Router();


router.use(AuthorizedUser);

router.get('/campaignList', campaignList);
router.get('/typeList', getTypeList);
router.post('/create', createCampaign);
router.patch('/delete-campaign', deleteCampaign);
router.patch('/update-campaign', updateCampaign);
router.get("/get-questions/:campaignID", getQuestion);
router.post('/create-questions', createQuestion);
router.post('/spList', getSpList);
router.post("/assigned-campaings", getAssignedCampaigns);
router.post("/get-survey", getSurveyQuestions);
router.post("/get-name", getCampaignName);
router.post("/save-survey", saveSurvey);
router.post("/total-survey-by-user", ByUserSurveyCount);


export default router;
