import { Router } from "express";
import { campaignList, createCampaign, deleteCampaign, getTypeList } from "../controllers/CampaignController";
import AuthorizedUser from "../middlewares/AuthorizedUser";


const router = Router();


router.use(AuthorizedUser);

router.get('/campaignList', campaignList);
router.get('/typeList', getTypeList);
router.post('/create', createCampaign);
router.patch('/delete-campaign', deleteCampaign);


export default router;
