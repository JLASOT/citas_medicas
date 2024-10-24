import routerx from "express-promise-router";
import tutorControlles from "../controllers/TutorControlles";

const router = routerx();

router.post('/',tutorControlles.create);
router.get('/:id?',tutorControlles.list);
router.put('/:id',tutorControlles.update);
router.delete('/:id',tutorControlles.remove);

export default router;