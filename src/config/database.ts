import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import {fileURLToPath} from 'url';
import {User, Module, UserModuleProgress,Task} from '@models/index.js';
import { log } from 'console';
// Configuración de paths

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';

class Database {
  private sequelize: Sequelize;

  constructor() {
    const databasePath = path.resolve(__dirname, './base.db');

    this.sequelize = new Sequelize({
      database: 'cursosJavascript',
      dialect: 'sqlite',
      storage: databasePath,
      models: [User, Module, UserModuleProgress,Task],
      logging: env === 'development' ? console.log : false,
      dialectOptions: {
        foreignKeys: true,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  /**
   * Autentica la conexión con la base de datos
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Conexión a SQLite establecida correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al conectar con SQLite:', error);
      return false;
    }
  }

  /**
   * Sincroniza los modelos con la base de datos
   * @param force Si es true, recrea las tablas (pérdida de datos)
   */
  public async syncDatabase(force: boolean = env === 'development'): Promise<boolean> {
    try {
      await this.sequelize.sync({force});
      console.log(`🔄 Modelos sincronizados (force: ${force})`);
      return true;
    } catch (error) {
      console.error('❌ Error al sincronizar modelos:', error);
      return false;
    }
  }

  /**
   * Cierra la conexión con la base de datos
   */
  public async closeConnection(): Promise<void> {
    try {
      await this.sequelize.close();
      console.log('🔌 Conexión a la base de datos cerrada');
    } catch (error) {
      console.error('❌ Error al cerrar la conexión:', error);
    }
  }

  /**
   * Ejecuta una migración manual (para cambios complejos)
   */
  public async runMigration(sql: string): Promise<boolean> {
    try {
      await this.sequelize.query(sql);
      console.log('🛠 Migración ejecutada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error en migración:', error);
      return false;
    }
  }

  /**
   * Obtiene la instancia de Sequelize
   */
  public getSequelize(): Sequelize {
    return this.sequelize;
  }
}

// Exportamos una instancia singleton de la base de datos
export const database = new Database();