import routerx from 'express-promise-router'
import User from './User'
import Patient from './Patient';
import Day from './Day';
import Hour from './Hour';
import Tutor from './Tutor';
import Specialitie from './Specialitie';
import Payment from './Payment';

// http://localhost:3000/api/users/register
const router = routerx();

router.use('/users',User);
router.use('/patients',Patient);
router.use('/days', Day);
router.use('/hours', Hour);
router.use('/tutor',Tutor);
router.use('/specialitie',Specialitie);
router.use('/Payment',Payment);

export default router;