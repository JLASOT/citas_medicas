import routerx from "express-promise-router";
import specialitieController from "../controllers/SpecialitieController";

import auth from '../service/auth';

const router = routerx();
router.post('/',auth.veryfyAdmin,specialitieController.create);
router.put('/:id',specialitieController.update);
router.get('/:id?',specialitieController.list);
router.delete('/:id',specialitieController.remove);

export default router;