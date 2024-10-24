import routerx from 'express-promise-router';
import hourController from '../controllers/HourController'; 

const router = routerx();

router.get("/:id?", hourController.list);
router.post("/", hourController.create);
router.put("/:id", hourController.update);
router.delete("/:id", hourController.remove);

export default router;
