import { Router } from 'express';
import { ProgressController } from '@controllers/progress.controller.js';
import { isAuthenticated } from '@middlewares/session.js';

const router = Router();

router.get('/', isAuthenticated, ProgressController.getUserProgress);
router.post('/', isAuthenticated, ProgressController.createProgress);
router.put('/:id', isAuthenticated ,ProgressController.updateProgress);

export default router;