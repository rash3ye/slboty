import { Router } from 'express';
import auth from './auth/auth.route';
import users from './users/user.route';

const router: Router = Router();

router.use('/health', (_, res) => res.status(200).json({live: true}));
router.use('/', auth);
router.use('/users', users);

export default router;
