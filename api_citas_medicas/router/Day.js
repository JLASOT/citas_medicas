import routerx from 'express-promise-router';
import dayController from '../controllers/DayController'; 

const router = routerx();

router.get("/:id?", dayController.list);
router.post("/", dayController.create);
router.put("/:id", dayController.update);
router.delete("/:id", dayController.remove);

export default router;
