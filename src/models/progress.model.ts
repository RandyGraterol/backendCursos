import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model.js';
import { Module } from './module.model.js';

@Table({
  tableName: 'user_module_progress',
  timestamps: true,
  paranoid: true, // Habilita eliminación suave (soft delete)
})
export class UserModuleProgress extends Model {
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
  declare status: 'locked' | 'available' | 'viewed' | 'completed';

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
    comment: 'Porcentaje de completitud del módulo (0-100)'
  })
  declare progress: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    defaultValue: null,
    comment: 'Ruta de la imagen de insignia obtenida',
    field: 'badge_image_url' // Nombre en snake_case para la BD
  })
  declare insignia: string | null; // Ruta/URL de la imagen de insignia

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
    comment: 'Puntos de penalización (0-100)'
  })
  declare penalizacion: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Fecha de completado del módulo'
  })
  declare completedAt: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Fecha del último acceso al módulo'
  })
  declare lastAccessedAt: Date | null;

  // Relaciones directas
  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Module)
  declare module: Module;
}