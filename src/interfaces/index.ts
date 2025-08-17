export interface IUser {
  id?: number;
  name: string;
  cedula: string;
  email: string;
  semester: string;
  password: string;
  preference: string;
  jsExperience: string;
  jsProjects: string;
  jsFrameworks: string;
  learningGoals: string;
  isActive?: boolean;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IModule {
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

export interface IUserModuleProgress {
  id?: number;
  userId: number;
  moduleId: number;
  status: 'locked' | 'available' | 'viewed' | 'completed';
  progress: number;
  insignia: string | null;
  penalizacion: number;
  completedAt: Date | null;
  lastAccessedAt: Date | null;
}

export interface IBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest extends IAuthRequest {
  name: string;
  cedula: string;
  semester: string;
  preference: string;
  role?: string;
}