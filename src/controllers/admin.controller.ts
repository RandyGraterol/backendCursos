import { Request, Response } from 'express';
import { User, UserModuleProgress, Module } from '@models/index.js';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'cedula', 'semester', 'preference', 'jsExperience']
    });
    
    const modules = await Module.findAll({
      order: [['order', 'ASC']]
    });
    
    const progressRecords = await UserModuleProgress.findAll({
      attributes: ['id', 'userId', 'moduleId', 'progress', 'status', 'penalizacion', 'insignia']
    });

    res.json({
      users,
      modules,
      progressRecords
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    await UserModuleProgress.destroy({ where: { userId: id } });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student' });
  }
};
export const modifyPoints = async (req: Request, res: Response) =>{
  try {
    console.log('Body recibido:', req.body);
    console.log('Params recibidos:', req.params);
    
    const { id } = req.params;
    const { points } = req.body;
    const action = req.method === 'POST' ? 'add' : 'remove';

    if (!points || isNaN(points)) {
      return res.status(400).json({ message: 'Puntos inválidos o no proporcionados' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Buscar todos los módulos disponibles
    const modules = await Module.findAll();
    if (modules.length === 0) {
      return res.status(404).json({ message: 'No hay módulos disponibles en el sistema' });
    }

    let progressRecords = await UserModuleProgress.findAll({ where: { userId: id } });
    
    // Si no hay registros de progreso, crearlos para todos los módulos
    if (progressRecords.length === 0) {
      console.log(`Creando registros de progreso iniciales para el usuario ${id}`);
      
      // Crear un registro de progreso por cada módulo
      const newProgressRecords = await Promise.all(
        modules.map(module => 
          UserModuleProgress.create({
            userId: id,
            moduleId: module.id,
            status: 'locked',
            progress: 0,
            penalizacion: 0
          })
        )
      );
      
      progressRecords = newProgressRecords;
    }

    // Actualizar el progreso en todos los registros
    const updatedRecords = await Promise.all(
      progressRecords.map(async record => {
        if (action === 'add') {
          record.progress = Math.min(100, record.progress + points);
        } else {
          record.progress = Math.max(0, record.progress - points);
        }
        
        // Si el progreso alcanza 100%, marcar como completado
        if (record.progress >= 100) {
          record.status = 'completed';
          record.completedAt = new Date();
        }
        
        await record.save();
        return record;
      })
    );

    // Calcular el progreso promedio
    const avgProgress = updatedRecords.length > 0 
      ? updatedRecords.reduce((sum, record) => sum + record.progress, 0) / updatedRecords.length
      : 0;
    res.json({ 
      success: true,
      message: `Puntos ${action === 'add' ? 'agregados' : 'quitados'} correctamente`,
      progressUpdated: updatedRecords.length,
      averageProgress: Math.round(avgProgress),
      detail: updatedRecords.map(r => ({
        moduleId: r.moduleId,
        progress: r.progress,
        status: r.status
      }))
    });
    
  } catch (error: any) {
    console.error('Error detallado:', error);
    res.status(500).json({ 
      message: `Error interno al ${req.method === 'POST' ? 'agregar' : 'quitar'} puntos`,
      error: error
    });
  }
};
export const modifyPenalty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const action = req.method === 'POST' ? 'add' : 'remove';

    const progressRecords = await UserModuleProgress.findAll({ where: { userId: id } });
    for (const record of progressRecords) {
      if (action === 'add') {
        record.penalizacion = Math.min(10, (record.penalizacion || 0) + 1);
      } else {
        record.penalizacion = Math.max(0, (record.penalizacion || 0) - 1);
      }
      await record.save();
    }

    res.json({ message: `Penalty ${action === 'add' ? 'added' : 'removed'} successfully` });
  } catch (error) {
    console.error(`Error ${req.method === 'POST' ? 'adding' : 'removing'} penalty:`, error);
    res.status(500).json({ message: `Error ${req.method === 'POST' ? 'adding' : 'removing'} penalty` });
  }
};

export const assignBadge = async (req: Request, res: Response) => {
  try {
    console.log(`//////////////////Iniciando funcion assignBadge////////////////`);
    const { studentId,badge} = req.body;
    console.log(`DATA DE REQ.BODY ${studentId} ${badge}`);
    // Verificar que el usuario existe
    const user = await User.findByPk(studentId);
    console.log(`///////////////DEBUGGIN DESPUES DE CONSULTAR USUARIO POR EL ID///////////////`);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`///////////////USUARIO ENCONTRADO///////////////`);
    console.log(`USUARIO: ${user}`);
    // Asignar insignia al primer registro de progreso disponible
    const progressRecord = await UserModuleProgress.findOne({ where: { userId: studentId } });
    if (!progressRecord) {
      return res.status(404).json({ message: 'No progress records found for user' });
    }
    progressRecord.insignia = badge || 'randy';
    await progressRecord.save();
      console.log(`INSIGNIA ASIGNADA : ${badge}`);
    res.json({ message: 'Badge assigned successfully' });
  } catch (error) {
    console.error('Error assigning badge:', error);
    res.status(500).json({ message: 'Error assigning badge' });
  }
};

export const createModule = async (req: Request, res: Response) => {
  try {
    const { title, description, duration, difficulty, category, videoUrl, subtopics, status, order } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newModule = await Module.create({
      title,
      description,
      duration,
      difficulty,
      category,
      videoUrl,
      subtopics: subtopics.filter((st: string) => st.trim() !== ''),
      status,
      order
    });

    res.status(201).json(newModule);
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ message: 'Error creating module' });
  }
};

export const updateModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const moduleData = req.body;

    const [updated] = await Module.update(moduleData, { where: { id } });
    
    if (updated) {
      const updatedModule = await Module.findByPk(id);
      res.json(updatedModule);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ message: 'Error updating module' });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Module.destroy({ where: { id } });
    
    if (deleted) {
      res.json({ message: 'Module deleted successfully' });
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ message: 'Error deleting module' });
  }
};

export const updateModuleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updated] = await Module.update({ status }, { where: { id } });
    
    if (updated) {
      const updatedModule = await Module.findByPk(id);
      res.json(updatedModule);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    console.error('Error updating module status:', error);
    res.status(500).json({ message: 'Error updating module status' });
  }
};