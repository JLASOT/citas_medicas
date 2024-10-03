import routerx from 'express-promise-router'
import User from './User'
import Patient from './Patient';

// http://localhost:3000/api/users/register
const router = routerx();

router.use('/users',User);
router.use('/patients',Patient);

export default router;