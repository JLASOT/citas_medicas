import routerx from "express-promise-router";
import specialitieController from "../controllers/SpecialitieController";

const router = routerx();
router.post('/',specialitieController.create);
router.put('/:id',specialitieController.update);
router.get('/:id?',specialitieController.list);
router.delete('/:id',specialitieController.remove);

export default router;