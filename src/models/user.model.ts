import { Table, Column, Model, DataType } from 'sequelize-typescript';

interface UserAttributes {
  id?: number;
  name: string;               // Nombre completo
  cedula: string;             // Número de cédula
  email: string;              // Correo electrónico
  semester: string;           // Semestre académico
  password: string;           // Contraseña
  preference: string;         // Área de interés en programación
  jsExperience: string;       // Nivel de experiencia con JavaScript
  jsProjects: string;         // Proyectos previos con JavaScript
  jsFrameworks: string;       // Frameworks conocidos
  learningGoals: string;      // Objetivos de aprendizaje
  isActive?: boolean;         // Estado de la cuenta
  role?: string;              // Rol del usuario
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<UserAttributes> {
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
    },
  })
  declare name: string;
  
  @Column({
    type: DataType.STRING(255),
    allowNull:true,
    defaultValue: 'sin imagen',
  })
  declare perfileImage: string; // URL o path de la imagen de perfil

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  declare cedula: string;
  
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  })
  declare email: string;
  
  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  declare semester: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255],
    },
  })
  declare password: string;
  
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Frontend', 'Backend', 'Full Stack', 'Mobile', 'Game Dev']],
    },
  })
  declare preference: string;
  
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Principiante', 'Básico', 'Intermedio', 'Avanzado']],
    },
  })
  declare jsExperience: string;
  
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  declare jsProjects: string;
  
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      isIn: [['Ninguno', 'React', 'Vue', 'Angular', 'jQuery', 'Node.js', 'Varios']],
    },
  })
  declare jsFrameworks: string;
  
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  declare learningGoals: string;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  declare isActive: boolean;
  
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'student', // Cambiado de 'user' a 'student'
    validate: {
      isIn: [['student', 'admin', 'moderator']],
    },
  })
  declare role: string;
}