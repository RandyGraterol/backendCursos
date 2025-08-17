import { Router } from 'express';
import { UsersController } from '@controllers/users.controller.js';
import { isAuthenticated } from '@middlewares/session.js';

const router = Router();

router.get('/',UsersController.getAllUsers);
router.get('/:id',UsersController.getUserById);
router.put('/:id', isAuthenticated, UsersController.updateUser);
router.delete('/:id',isAuthenticated, UsersController.deleteUser);

export default router;