import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router: Router = Router();

router.get('/dashboard/properties/', DashboardController.getTotalProperties);
router.get('/dashboard/properties/categories', DashboardController.getPropertiesByCategory);
router.get('/dashboard/properties/latest/:id', DashboardController.getLatestProperties);

export default router;