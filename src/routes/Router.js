import { Router } from 'express';
import UserRouter from './UserRouter';
import CampaignRouter from './CampaignRouter';
import AuthRouter from './authRouter'

const router = Router();
router.use('/userRouter', UserRouter);
router.use('/campaignRouter', CampaignRouter);
router.use('/auth', AuthRouter);

export default router;