import { Router } from 'express';
import {PropertyController } from '../controllers/property.controller';

const router: Router = Router();

router.get('/properties', PropertyController.getAll);
router.get('/properties/:id', PropertyController.getById);

router.put('/properties/:id', PropertyController.update);
router.patch('/properties/:id', PropertyController.setActive);

export default router;
