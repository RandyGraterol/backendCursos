import 'reflect-metadata'; // Necesario para sequelize-typescript
import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { setupRelations } from '@models/index.js';
import { database } from '@config/database.js';
import authRoutes from '@routes/auth.routes.js';
import modulesRoutes from '@routes/modules.routes.js';
import progressRoutes from '@routes/progress.routes.js';
import usersRoutes from '@routes/users.routes.js';
import adminRoutes from '@routes/admin.routes.js';
import taskRoutes from './routes/task.routes.js';

// Configuración de variables de entorno
dotenv.config();

// Configuración de paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

const corsOptions = {
  origin: '*', // Permite todos los orígenes temporalmente
  credentials: true,
  // ... resto de la configuración
};
app.use(cors(corsOptions));

// Configuración de sesión (actualizada para CORS)
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false, // Cambia a true en producción con HTTPS
      sameSite: 'lax', // Importante para CORS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    }
}));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Manejo de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error global:', err.stack);
  res.status(500).json({ error: 'Ocurrió un error interno' });
});

// Función para limpieza antes de cerrar
async function gracefulShutdown() {
  console.log('\n🔌 Iniciando cierre limpio...');
  
  try {
    // 1. Cerrar conexión a la base de datos
    await database.closeConnection();
    console.log('✅ Conexiones a base de datos cerradas');
    
    // 2. Cerrar servidor HTTP
    if (server) {
      server.close(() => {
        console.log('🛑 Servidor HTTP detenido');
        process.exit(0);
      });
      
      // Timeout para forzar cierre si tarda demasiado
      setTimeout(()=>{
        console.warn('⚠️ Forzando cierre por timeout');
        process.exit(1);
      }, 5000);
    } else{
      process.exit(0);
    }
  } catch (error){
    console.error('❌ Error durante el cierre:', error);
    process.exit(1);
  }
}

let server: ReturnType<typeof app.listen>;
// Rutas
app.use('/api', adminRoutes);
app.use('/auth', authRoutes);
app.use('/modules',modulesRoutes);
app.use('/progress',progressRoutes);
app.use('/users',usersRoutes);
app.use('/tasks', taskRoutes);
// Función para iniciar el servidor
async function startServer() {
  try {
    setupRelations();
    // 1. Conectar a la base de datos
    if (!await database.testConnection()) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // 2. Sincronizar modelos (solo force en desarrollo)
    const forceSync = process.env.NODE_ENV === 'developmentT';
    if (!await database.syncDatabase(forceSync)) {
      throw new Error('Error al sincronizar modelos con la base de datos');
    }

    console.log('✅ Base de datos conectada y modelos sincronizados');

    // 3. Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.set('trust proxy', true);
    server = app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });

    // Manejadores para diferentes señales de terminación
    process.on('SIGINT', gracefulShutdown);  // Ctrl+C
    process.on('SIGTERM', gracefulShutdown); // Kill command
    process.on('SIGUSR2', gracefulShutdown); // Nodemon restart
    
    // Manejo específico para reinicio con Nodemon
    process.once('SIGUSR2', async () => {
      await gracefulShutdown();
      process.kill(process.pid, 'SIGUSR2'); // Re-emite la señal
    });

  } catch (error) {
    console.error('🔥 Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

// Iniciar la aplicación
startServer();