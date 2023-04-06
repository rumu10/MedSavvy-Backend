import { Router } from "express";
import { campaignList, createCampaign, createQuestion, deleteCampaign, getQuestion, getTypeList } from "../controllers/CampaignController";
import AuthorizedUser from "../middlewares/AuthorizedUser";


const router = Router();


router.use(AuthorizedUser);

router.get('/campaignList', campaignList);
router.get('/typeList', getTypeList);
router.post('/create', createCampaign);
router.patch('/delete-campaign', deleteCampaign);
router.get("/get-questions/:campaignID", getQuestion);
router.post('/create-questions', createQuestion);


export default router;
