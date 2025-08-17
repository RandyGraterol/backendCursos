import { Request, Response } from 'express';
import { User,UserModuleProgress} from '../models/index.js';

export class UsersController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [{
          model: UserModuleProgress,
          as: 'progressRecords',
          attributes: ['moduleId', 'status', 'progress', 'completedAt']
        }]
      });
      res.json(users);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: UserModuleProgress,
          as: 'progressRecords',
          include: ['module']
        }]
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      await user.update(updates);
      res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      await user.destroy();
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
}