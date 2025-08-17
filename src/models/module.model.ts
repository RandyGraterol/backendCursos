import { Table, Column, Model, DataType } from 'sequelize-typescript';

interface ModuleAttributes {
  id?: number;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'fundamentals' | 'intermediate' | 'advanced' | 'projects';
  status: 'locked' | 'available' | 'viewed' | 'completed';
  order: number;
  subtopics: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'modules',
  timestamps: true,
})
export class Module extends Model<ModuleAttributes> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100],
    },
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  declare description: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  declare duration: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    validate: {
      isUrl: true,
    },
    field: 'video_url',
  })
  declare videoUrl: string;

  @Column({
    type: DataType.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false,
    defaultValue: 'beginner',
  })
  declare difficulty: 'beginner' | 'intermediate' | 'advanced';

  @Column({
    type: DataType.ENUM('fundamentals', 'intermediate', 'advanced', 'projects'),
    allowNull: false,
    defaultValue: 'fundamentals',
  })
  declare category: 'fundamentals' | 'intermediate' | 'advanced' | 'projects';

  @Column({
    type: DataType.ENUM('locked', 'available', 'viewed', 'completed'),
    allowNull: false,
    defaultValue: 'available',
  })
  declare status: 'locked' | 'available' | 'viewed' | 'completed';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  })
  declare order: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: [],
  })
  declare subtopics: string[];
}