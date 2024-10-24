import routerx from 'express-promise-router'
import User from './User'
import Patient from './Patient';
import Day from './Day';
import Hour from './Hour';

// http://localhost:3000/api/users/register
const router = routerx();

router.use('/users',User);
router.use('/patients',Patient);
router.use('/days', Day);
router.use('/hours', Hour);

export default router;