import { Router } from "express";
import { getRoleList, userList } from "../controllers/UserController";
import AuthorizedUser from "../middlewares/AuthorizedUser";


const router = Router();


router.use(AuthorizedUser);
router.get('/userList', userList);
router.get('/roleList', getRoleList);



export default router;
