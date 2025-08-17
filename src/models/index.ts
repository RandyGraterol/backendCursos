import { User } from './user.model.js';
import { Module } from './module.model.js';
import { UserModuleProgress } from './progress.model.js';
import {Task} from './task.model.js';
// Exportar modelos individuales
export { User, Module, UserModuleProgress,Task};
{/*##############################################################################################*/}
// Configuración de relaciones
export function setupRelations() {
  // Relación muchos-a-muchos entre User y Module
  User.belongsToMany(Module, {
    through: UserModuleProgress,
    foreignKey: 'userId',
    otherKey: 'moduleId',
    as: 'modules',
    onDelete: 'CASCADE', // Elimina el progreso si se borra el usuario
    onUpdate: 'CASCADE'  // Actualiza en cascada los IDs
  });
  Module.belongsToMany(User, {
    through: UserModuleProgress,
    foreignKey: 'moduleId',
    otherKey: 'userId',
    as: 'users',
    onDelete: 'CASCADE', // Elimina el progreso si se borra el módulo
    onUpdate: 'CASCADE'
  });
{/*##############################################################################################*/}
 // Relación muchos-a-muchos entre User y Module usando Task
  User.belongsToMany(Module, {
    through: Task,
    foreignKey: 'userId', // Debe ser userId (no moduleId como tenías)
    otherKey: 'moduleId',
    as: 'modulesTasks', // Nombre diferente para evitar conflicto
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Module.belongsToMany(User, {
    through: Task,
    foreignKey: 'moduleId',
    otherKey: 'userId',
    as: 'usersTasks', // Nombre diferente para evitar conflicto
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
{/*##############################################################################################*/}
  // Relaciones específicas del progreso
  User.hasMany(UserModuleProgress, {
    foreignKey: 'userId',
    as: 'progressRecords',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  Module.hasMany(UserModuleProgress, {
    foreignKey: 'moduleId',
    as: 'userProgress',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
{/*##############################################################################################*/}
 User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks', // Nombre diferente para evitar conflicto
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  Module.hasMany(Task, {
    foreignKey: 'moduleId',
    as: 'moduleTasks', // Nombre diferente para evitar conflicto
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
{/*##############################################################################################*/}
  // Nota: Las relaciones UserModuleProgress.belongsTo ya están definidas
  // en el modelo con los decoradores @BelongsTo
}