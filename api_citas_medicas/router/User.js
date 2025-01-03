import routerx from 'express-promise-router'
import userController from '../controllers/UserController';
import auth from '../service/auth';

const router = routerx();

router.post("/",userController.register)
router.post("/login",userController.login)

router.put("/:id",userController.update)
router.get("/:id?",auth.veryfyMedico,userController.list)
router.delete("/:id",auth.veryfyAdmin,userController.remove)

export default router;

