import { Request, Response } from 'express';
import { User,Module,UserModuleProgress} from '@models/index.js';
import { IAuthRequest, IRegisterRequest } from '../interfaces/index.js';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import {Op} from 'sequelize';
// Configuración de variables de entorno
dotenv.config();
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: any; // o el tipo específico de tu usuario
  }
}

// Configuración de paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Verificar si el usuario existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
      
      // Verificar si la cuenta está activa
      if (!user.isActive) {
        return res.status(403).json({ message: 'Tu cuenta está desactivada' });
      }
      
      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
      
      const userResponse = {
        id: user.id,
        name: user.name,
        cedula: user.cedula,
        email: user.email,
        semester: user.semester,
        preference: user.preference,
        jsExperience: user.jsExperience,
        jsProjects: user.jsProjects,
        jsFrameworks: user.jsFrameworks,
        learningGoals: user.learningGoals,
        isActive: user.isActive,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      req.session.userId=user.id;
      res.json({
        message: 'Inicio de sesión exitoso',
        user: userResponse
      });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
  
  static async register(req: Request, res: Response) {
    try {
      const { name, cedula, email, semester, password, preference, 
        jsExperience, jsProjects, jsFrameworks, learningGoals } = req.body;
        
        // Verificar si el usuario ya existe por email o cédula
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [
              { email },
              { cedula }
            ]
          }
        });
        
        if (existingUser) {
          return res.status(400).json({ 
            message: existingUser.email === email 
            ? 'El email ya está registrado' 
            : 'La cédula ya está registrada' 
          });
        }
        
        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Crear nuevo usuario
        const newUser = await User.create({
          name,
          cedula,
          email,
          semester,
          password: hashedPassword,
          preference,
          jsExperience,
          jsProjects,
          jsFrameworks,
          learningGoals,
          isActive: true,
          role: 'student'
        });
        
        // Buscar todos los módulos disponibles
        const modules = await Module.findAll();
        if (modules.length === 0) {
          return res.status(404).json({ message: 'No hay módulos disponibles en el sistema' });
        }
            let progressRecords = await UserModuleProgress.findAll({ where: { userId: newUser.id } });
            
            // Si no hay registros de progreso, crearlos para todos los módulos
            if (progressRecords.length === 0) {
              console.log(`Creando registros de progreso iniciales para el usuario ${newUser.id}`);
              
              // Crear un registro de progreso por cada módulo
              const newProgressRecords = await Promise.all(
                modules.map(module => 
                  UserModuleProgress.create({
                    userId: newUser.id,
                    moduleId: module.id,
                    status: 'locked',
                    insignia:'principiante',
                    progress: 0,
                    penalizacion: 0
                  })
                )
              );
              
              progressRecords = newProgressRecords;
            }
        
        // No devolver la contraseña en la respuesta
        const userResponse = {
          id: newUser.id,
          name: newUser.name,
          cedula: newUser.cedula,
          email: newUser.email,
          semester: newUser.semester,
          preference: newUser.preference,
          jsExperience: newUser.jsExperience,
          jsProjects: newUser.jsProjects,
          jsFrameworks: newUser.jsFrameworks,
          learningGoals: newUser.learningGoals,
          isActive: newUser.isActive,
          role: newUser.role,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        };
        
        res.status(201).json({
          message: 'Usuario registrado exitosamente',
          user: userResponse,
        });
      } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
      }
    }
    
    static async logout(req: Request, res: Response) {
      try {
        res.clearCookie('token');
        res.json({ message: 'Sesión cerrada correctamente' });
      } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ message: 'Error en el servidor' });
      }
    }
    
    static async getSession(req: Request, res: Response) {
      try {
        const sesion = req.session.userId;
        if (!sesion) {
          return res.status(401).json({ message: 'No autenticado' });
        }
        
        const user = await User.findByPk(req?.session?.userId, {
          attributes: { exclude: ['password'] }
        });
        
        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json(user);
      } catch (error) {
        console.error('Error obteniendo sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
      }
    }
  }