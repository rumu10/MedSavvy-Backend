import { Router } from "express";
import { createUser, deleteUser, getRoleList, userList } from "../controllers/UserController";
import AuthorizedUser from "../middlewares/AuthorizedUser";


const router = Router();


router.use(AuthorizedUser);

router.get('/userList', userList);
router.get('/roleList', getRoleList);
router.post('/create', createUser);
router.patch('/delete-user', deleteUser);


export default router;
