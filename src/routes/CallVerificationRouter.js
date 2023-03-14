import { Router } from "express";
import AuthorizedUser from "../middlewares/AuthorizedUser";
import users from "../models/Users";


const router = Router();
router.get(async()=> {
    const rows = await users.findAll({
        order: ['id'],
        limit: 10,
      });
    console.log('row', rows)
})
router.use(AuthorizedUser);



export default router;
