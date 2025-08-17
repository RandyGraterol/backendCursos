import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model.js';
import { Module } from './module.model.js';

@Table({
  tableName: 'task_user',
  timestamps: true,
  paranoid: true, // Habilita eliminación suave (soft delete)
})
export class Task extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;
  
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'ID del usuario relacionado'
  })
  declare userId: number;

  @ForeignKey(() => Module)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'ID del módulo relacionado'
  })
  declare moduleId: number;

  @Column({
    type: DataType.ENUM('locked', 'available', 'viewed', 'completed'),
    allowNull: false,
    defaultValue: 'locked',
    comment: 'Estado de progreso del módulo para el usuario'
  })
  declare status: 'asignado' | 'proceso' | 'revision' | 'completado';

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
    comment: 'Porcentaje de completitud del módulo (0-100)'
  })
  declare tarea: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Fecha de completado de tarea'
  })
  declare completedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Fecha del último acceso a la tarea'
  })
  declare lastAccessedAt: Date | null;

  // Relaciones directas
  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Module)
  declare module: Module;
}