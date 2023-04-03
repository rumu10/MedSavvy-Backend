import { Router } from 'express';
import { SignInWeb } from '../controllers/AuthController';


const router = Router();

router.post('/signin', SignInWeb);


export default router;