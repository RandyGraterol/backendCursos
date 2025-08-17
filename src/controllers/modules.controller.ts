import { Request, Response } from 'express';
import { Module,UserModuleProgress} from '@models/index.js';

export class ModulesController {
  static async getAllModules(req: Request, res: Response) {
    try {
      const modules = await Module.findAll({
        order: [['order', 'ASC']],
        include: [{
          model: UserModuleProgress,
          as: 'userProgress'
        }]
      });
      res.json(modules);
    } catch (error) {
      console.error('Error obteniendo módulos:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async getModuleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const module = await Module.findByPk(id, {
        include: [{
          model: UserModuleProgress,
          as: 'userProgress',
          include: ['user']
        }]
      });
      
      if (!module) {
        return res.status(404).json({ message: 'Módulo no encontrado' });
      }
      
      res.json(module);
    } catch (error) {
      console.error('Error obteniendo módulo:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async createModule(req: Request, res: Response) {
    try {
      const newModule = await Module.create(req.body);
      res.status(201).json(newModule);
    } catch (error) {
      console.error('Error creando módulo:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async updateModule(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const module = await Module.findByPk(id);
      
      if (!module) {
        return res.status(404).json({ message: 'Módulo no encontrado' });
      }
      
      await module.update(req.body);
      res.json(module);
    } catch (error) {
      console.error('Error actualizando módulo:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async deleteModule(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const module = await Module.findByPk(id);
      
      if (!module) {
        return res.status(404).json({ message: 'Módulo no encontrado' });
      }
      
      await module.destroy();
      res.json({ message: 'Módulo eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando módulo:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
}