import { Request, Response } from 'express';
import { UserModuleProgress,User,Module} from '../models/index.js';

export class ProgressController {
  static async getUserProgress(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ message: 'Se requiere userId' });
      }
      
      const progress = await UserModuleProgress.findAll({
        where: { userId },
        include: [
          { model: Module, as: 'module' },
          { model: User, as: 'user' }
        ]
      });
      
      res.json(progress);
    } catch (error) {
      console.error('Error obteniendo progreso:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async updateProgress(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, progress, insignia, penalizacion } = req.body;
      
      const progressRecord = await UserModuleProgress.findByPk(id);
      if (!progressRecord) {
        return res.status(404).json({ message: 'Registro de progreso no encontrado' });
      }
      
      const updates: any = {};
      if (status) updates.status = status;
      if (progress !== undefined) updates.progress = progress;
      if (insignia !== undefined) updates.insignia = insignia;
      if (penalizacion !== undefined) updates.penalizacion = penalizacion;
      
      if (status === 'completed') {
        updates.completedAt = new Date();
      }
      
      await progressRecord.update(updates);
      res.json(progressRecord);
    } catch (error) {
      console.error('Error actualizando progreso:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async createProgress(req: Request, res: Response) {
    try {
      const { userId, moduleId } = req.body;
      
      const existingProgress = await UserModuleProgress.findOne({
        where: { userId, moduleId }
      });
      
      if (existingProgress) {
        return res.status(400).json({ message: 'Ya existe un registro de progreso para este usuario y módulo' });
      }
      
      const newProgress = await UserModuleProgress.create({
        userId,
        moduleId,
        status: 'locked',
        progress: 0,
        penalizacion: 0,
        insignia: null,
        completedAt: null,
        lastAccessedAt: new Date()
      });
      
      res.status(201).json(newProgress);
    } catch (error) {
      console.error('Error creando progreso:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
}