import { Router } from "express";
import { accessList, createRole, createUser, deleteUser, getRole, getRoleList, getUser, updateUser, userList } from "../controllers/UserController";
import AuthorizedUser from "../middlewares/AuthorizedUser";


const router = Router();


router.use(AuthorizedUser);

router.get('/userList', userList);
router.get('/roleList', getRoleList);
router.post('/create', createUser);
router.patch('/delete-user', deleteUser);
router.get('/getUser/:id', getUser);
router.post('/update', updateUser);
router.get('/role-access-list', accessList);
router.post('/role-create', createRole);
router.get('/getRole/:id', getRole);

export default router;
