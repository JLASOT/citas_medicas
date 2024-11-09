import routerx from 'express-promise-router'
import patientController from '../controllers/PatientController'
import auth from '../service/auth';
const router = routerx();

router.post("/",patientController.create);
router.put("/:id",patientController.update);
router.get("/",patientController.list);
router.get("/:id",patientController.listPatient);
router.delete("/:id",auth.veryfyAdmin,patientController.remove);

export default router;
