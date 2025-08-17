import { Request, Response } from 'express';

// Datos de ejemplo para insignias
const badges = [
  {
    id: 'js_novice',
    name: 'Novato en JS',
    icon: '🌟',
    description: 'Completaste tu primer módulo de JavaScript'
  },
  {
    id: 'js_beginner',
    name: 'Principiante en JS',
    icon: '🌱',
    description: 'Completaste 3 módulos de nivel principiante'
  },
  {
    id: 'js_intermediate',
    name: 'Intermedio en JS',
    icon: '⚡',
    description: 'Completaste 2 módulos de nivel intermedio'
  },
  {
    id: 'js_advanced',
    name: 'Avanzado en JS',
    icon: '🔥',
    description: 'Completaste 1 módulo de nivel avanzado'
  },
  {
    id: 'js_project',
    name: 'Constructor de Proyectos',
    icon: '🏗️',
    description: 'Completaste un proyecto práctico'
  },
  {
    id: 'js_quiz_master',
    name: 'Maestro de Quizzes',
    icon: '🧠',
    description: 'Obtuviste más del 90% en un quiz'
  },
  {
    id: 'js_speedster',
    name: 'Velocista de JS',
    icon: '⚡️',
    description: 'Completaste un módulo en menos de 24 horas'
  },
  {
    id: 'js_perfectionist',
    name: 'Perfeccionista',
    icon: '🎯',
    description: 'Obtuviste 100% de progreso en un módulo'
  }
];

export class BadgesController {
  static async getAllBadges(req: Request, res: Response) {
    try {
      res.json(badges);
    } catch (error) {
      console.error('Error obteniendo insignias:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  static async getBadgeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const badge = badges.find(b => b.id === id);
      
      if (!badge) {
        return res.status(404).json({ message: 'Insignia no encontrada' });
      }
      
      res.json(badge);
    } catch (error) {
      console.error('Error obteniendo insignia:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
}