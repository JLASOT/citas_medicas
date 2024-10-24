import routerx from 'express-promise-router';
import User from './User';
import Patient from './Patient';
import Day from './Day';
import Hour from './Hour';
import Tutor from './Tutor';
import Specialitie from './Specialitie';
import Payment from './Payment';
import DayHour from './DayHour';


const router = routerx(); // Crear la instancia de router


router.use('/users', User);
router.use('/patients', Patient);
router.use('/days', Day);
router.use('/hours', Hour);
router.use('/tutor', Tutor);
router.use('/specialitie', Specialitie);
router.use('/payment', Payment);
router.use('/dayhours', DayHour);

export default router;
