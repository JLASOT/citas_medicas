import routerx from "express-promise-router";
import PaymentController from "../controllers/PaymentController";

const router = routerx();

router.post('/',PaymentController.create);
router.get('/:id?',PaymentController.list);
router.put('/:id',PaymentController.update);
router.delete('/:id',PaymentController.remove);

export default router;