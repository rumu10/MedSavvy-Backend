import { Router } from 'express';
import CallVerificationRouter from './CallVerificationRouter';

const router = Router();
router.use('/callverification', CallVerificationRouter);

export default router;