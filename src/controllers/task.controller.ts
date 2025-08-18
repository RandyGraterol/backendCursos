import { Request, Response } from 'express';
import { Task,User,Module} from '../models/index.js';

export const taskController = {
  // Crear nueva tarea asignada
  async createTask(req: Request, res: Response) {
    try {
      const { userId, moduleId, status, tarea } = req.body;
      
      // Validaciones básicas
      if (!userId || !moduleId) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (userId, moduleId)' });
      }
      
      // Verificar que existan el usuario y módulo
      const user = await User.findByPk(userId);
      const module = await Module.findByPk(moduleId);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      if (!module) {
        return res.status(404).json({ error: 'Módulo no encontrado' });
      }
      
      // Crear la tarea
      const newTask = await Task.create({
        userId,
        moduleId,
        status: status || 'asignado', // Valor por defecto
        tarea: tarea || '', // Valor por defecto
        completedAt: null,
        lastAccessedAt: new Date() // Fecha actual como último acceso
      });
      
      // Obtener la tarea con relaciones para la respuesta
      const taskWithRelations = await Task.findByPk(newTask.id, {
        include: [
          { model: User, attributes: ['id', 'name'] },
          { model: Module, attributes: ['id', 'name'] }
        ]
      });
      
      res.status(201).json(taskWithRelations);
      
    } catch (error) {
      console.error('Error al crear tarea:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  ,
  async getAllTasks(req: Request, res: Response) {
    try{
       const tasks = await Task.findAll({
        include: [
          { model: User, attributes: ['id', 'name'] },      
          { model: Module, attributes: ['id', 'title'] }
        ]
      });
      res.status(200).json(tasks);
    }catch (error) {
      console.error('Error obteniendo tareas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}