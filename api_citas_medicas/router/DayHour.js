import routerx from "express-promise-router";
import dayHourController from "../controllers/DayHourController"; // Asegúrate de que el nombre del archivo del controlador sea correcto

const router = routerx();

router.get('/:id?', dayHourController.list);
router.post('/', dayHourController.create);
router.put('/:id', dayHourController.update);
router.delete('/:id', dayHourController.remove);

export default router;
