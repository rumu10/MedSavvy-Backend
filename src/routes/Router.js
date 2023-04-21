import { Router } from 'express';
import UserRouter from './UserRouter';
import CampaignRouter from './CampaignRouter';
import AuthRouter from './authRouter';
import DashboardRouter from './DashboardRouter';

const router = Router();
router.use('/userRouter', UserRouter);
router.use('/campaignRouter', CampaignRouter);
router.use('/auth', AuthRouter);
router.use('/dashBoardRouter', DashboardRouter);

export default router;