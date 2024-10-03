import routerx from 'express-promise-router'
import patientController from '../controllers/PatientController'

const router = routerx();

router.post("/",patientController.create);
router.put("/:id",patientController.update);
router.get("/:id?",patientController.list);
router.delete("/:id",patientController.remove);

export default router;
