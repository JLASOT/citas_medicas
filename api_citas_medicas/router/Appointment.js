import routerx from "express-promise-router";
import AppointmentController from '../controllers/AppointmentController'


const router = routerx();

router.post('/',AppointmentController.create);
router.get('/:id?',AppointmentController.list);
router.put('/:id',AppointmentController.update);
router.delete('/:id',AppointmentController.remove);

export default router;
