import { Router } from 'express';
import { TokenValidation } from '../libs/tokenValidation';
import { RoleValidation } from '../libs/roleValidation';
import { UserController } from '../controllers/user.controller';

const router: Router = Router();

router.get('/users', TokenValidation, UserController.getAll);
router.get('/users/:id', TokenValidation, UserController.getOne);
router.put('/users/:id', TokenValidation, UserController.update);
router.delete('/users/:id', TokenValidation, RoleValidation, UserController.delete);

export default router;
