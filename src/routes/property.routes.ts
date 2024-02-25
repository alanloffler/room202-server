import { Router } from 'express';
import { getProperties, getProperty } from '../controllers/property.controller';

const router: Router = Router();

router.get('/properties', getProperties);
router.get('/property/:id', getProperty);

export default router;
