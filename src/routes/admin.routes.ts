import express from 'express';
import {
  getDashboardData,
  deleteStudent,
  modifyPoints,
  modifyPenalty,
  assignBadge,
  createModule,
  updateModule,
  deleteModule,
  updateModuleStatus
} from '../controllers/admin.controller.js';
const router = express.Router();
// Dashboard data
router.get('/admin/dashboard', getDashboardData);
// Student management
router.post('/students/badge', assignBadge);
router.delete('/students/:id', deleteStudent);
router.post('/students/:id/points', modifyPoints);
router.delete('/students/:id/points', modifyPoints);
router.post('/students/:id/penalties', modifyPenalty);
router.delete('/students/:id/penalties', modifyPenalty);

// Module management
router.post('/modules', createModule);
router.put('/modules/:id', updateModule);
router.delete('/modules/:id', deleteModule);
router.put('/modules/:id/status', updateModuleStatus);

export default router;