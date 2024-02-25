import { Router } from 'express';
import { TokenValidation } from '../libs/tokenValidation';
import { RoleValidation } from '../libs/roleValidation';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller';

const router: Router = Router();

router.get('/users', TokenValidation, getUsers);
router.get('/users/:id', TokenValidation, getUser);
router.put('/users/:id', TokenValidation, updateUser);
router.delete('/users/:id', TokenValidation, RoleValidation, deleteUser);

export default router;
