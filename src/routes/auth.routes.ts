import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router: Router = Router();

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);

export default router;
