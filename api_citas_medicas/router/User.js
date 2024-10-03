import routerx from 'express-promise-router'
import userController from '../controllers/UserController'

const router = routerx();

router.post("/",userController.register)
router.post("/login",userController.login)

router.put("/:id",userController.update)
router.get("/",userController.list)
router.delete("/:id",userController.remove)


export default router;

