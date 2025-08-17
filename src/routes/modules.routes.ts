import { Router } from 'express';
import { ModulesController } from '@controllers/modules.controller.js';
import { isAuthenticated } from '@middlewares/session.js';

const router = Router();

router.get('/', ModulesController.getAllModules);
router.get('/:id', ModulesController.getModuleById);
router.post('/', isAuthenticated, ModulesController.createModule);
router.put('/:id', isAuthenticated, ModulesController.updateModule);
router.delete('/:id', isAuthenticated, ModulesController.deleteModule);

export default router;