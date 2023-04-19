import { Router } from 'express';
import { SignInWeb, sendEmail } from '../controllers/AuthController';


const router = Router();

router.post('/signin', SignInWeb);
router.post('/forget-password',sendEmail);

export default router;