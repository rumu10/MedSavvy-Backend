import { Router } from "express";
import AuthorizedUser from "../middlewares/AuthorizedUser";
import { AgeofCustomers } from "../controllers/DashboardController";


const router = Router();


router.use(AuthorizedUser);

router.post('/analysis-1', AgeofCustomers);


export default router;
