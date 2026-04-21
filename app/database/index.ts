import * as SQLite from 'expo-sqlite';
import {
  CREATE_ACCOUNTS_TABLE,
  CREATE_BILLS_TABLE,
  CREATE_TRANSACTIONS_TABLE,
} from './schema';

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
      await this.db.execAsync(CREATE_BILLS_TABLE);
      await this.ensureBillColumns();
      await this.ensureBillRecurrenceConstraint();
      console.log('Tables created successfully');
    } catch (error) {
      console.error('Failed to create tables:', error);
      throw error;
    }
  }

  private async ensureBillColumns(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const columns = await this.db.getAllAsync('PRAGMA table_info(bills)');
    const columnNames = new Set(
      (columns || []).map((column: any) => String(column.name))
    );

    if (!columnNames.has('is_recurring')) {
      await this.db.execAsync(
        "ALTER TABLE bills ADD COLUMN is_recurring INTEGER NOT NULL DEFAULT 0 CHECK (is_recurring IN (0, 1))"
      );
    }

    if (!columnNames.has('recurrence_frequency')) {
      await this.db.execAsync(
        "ALTER TABLE bills ADD COLUMN recurrence_frequency TEXT CHECK (recurrence_frequency IN ('weekly', 'bi-weekly', 'monthly'))"
      );
    }
  }

  private async ensureBillRecurrenceConstraint(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const tableDefinition = await this.db.getFirstAsync(
      "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'bills'"
    ) as { sql?: string } | null;

    if (!tableDefinition?.sql || tableDefinition.sql.includes("'bi-weekly'")) {
      return;
    }

    await this.db.execAsync(`
      BEGIN TRANSACTION;
      ALTER TABLE bills RENAME TO bills_legacy;
      ${CREATE_BILLS_TABLE}
      INSERT INTO bills (
        id,
        name,
        amount,
        due_date,
        status,
        is_recurring,
        recurrence_frequency,
        paid_at,
        created_at,
        updated_at
      )
      SELECT
        id,
        name,
        amount,
        due_date,
        status,
        COALESCE(is_recurring, 0),
        CASE
          WHEN recurrence_frequency IN ('weekly', 'monthly') THEN recurrence_frequency
          ELSE NULL
        END,
        paid_at,
        created_at,
        updated_at
      FROM bills_legacy;
      DROP TABLE bills_legacy;
      COMMIT;
    `);
  }

  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }
}

export const databaseService = new DatabaseService();
