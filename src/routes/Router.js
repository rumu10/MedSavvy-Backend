import { Router } from 'express';
import UserRouter from './UserRouter';
import AuthRouter from './authRouter'

const router = Router();
router.use('/userRouter', UserRouter);
router.use('/auth', AuthRouter);

export default router;