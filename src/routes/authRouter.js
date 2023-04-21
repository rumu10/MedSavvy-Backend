import { Router } from 'express';
import { SignInWeb, resetPass, sendEmail } from '../controllers/AuthController';


const router = Router();

router.post('/signin', SignInWeb);
router.post('/forget-password',sendEmail);
router.post('/reset-password', resetPass);

export default router;