import { Router } from 'express';
import { getUIBusiness, getUICategories } from '../controllers/ui.controller';

const router: Router = Router();

router.get('/ui/business', getUIBusiness);
router.get('/ui/categories', getUICategories);

export default router;
