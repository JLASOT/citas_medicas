import routerx from "express-promise-router";
import AppointmentController from '../controllers/AppointmentController'

import auth from '../service/auth';
const router = routerx();

router.post('/',AppointmentController.create);
router.get('/:id?',auth.veryfyMedico,AppointmentController.list);
router.put('/:id',AppointmentController.update);
router.delete('/:id',AppointmentController.remove);

export default router;
