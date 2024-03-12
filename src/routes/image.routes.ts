import { Router } from 'express';
import { ImageController} from '../controllers/image.controller';
import multer from '../libs/multer';

const router = Router();

router.post('/images/:id', multer.single('file'), ImageController.create);
router.get('/images/:id', ImageController.getById);
router.delete('/images/:id', ImageController.delete);

export default router;
