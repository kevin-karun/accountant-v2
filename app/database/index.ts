import * as SQLite from 'expo-sqlite';
import { CREATE_ACCOUNTS_TABLE, CREATE_TRANSACTIONS_TABLE } from './schema';

const DATABASE_NAME = 'accountant.db';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      await this.db.execAsync(CREATE_ACCOUNTS_TABLE);
      await this.db.execAsync(CREATE_TRANSACTIONS_TABLE);
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Failed to create tables:', error);
      throw error;
    }
  }

  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }
}

export const databaseService = new DatabaseService();