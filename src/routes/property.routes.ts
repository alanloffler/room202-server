import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';

const router: Router = Router();

router.get('/properties', PropertyController.getAll);
router.post('/properties', PropertyController.create);
router.get('/properties/:id', PropertyController.getOne);
router.put('/properties/:id', PropertyController.update);
router.patch('/properties/:id', PropertyController.setActive);
router.delete('/properties/:id', PropertyController.delete);

export default router;
