import express from 'express';
import { taskController } from '../controllers/task.controller.js';

const router = express.Router();

// POST /api/tasks - Crear nueva tarea asignada
router.post('/', taskController.createTask);
router.get('/getAllTasks', taskController.getAllTasks);

// Exportar router
export default router;