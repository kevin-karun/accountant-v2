import { databaseService } from './index';
import { Account } from './types';

function generateAccountId(): string {
  const random = Math.random().toString(36).substring(2, 9);
  return `acc_${Date.now()}_${random}`;
}

export async function createAccount(
  name: string,
  type: 'bank' | 'credit_card' | 'cash' | 'other',
  opening_balance: number
): Promise<Account> {
  const db = databaseService.getDatabase();
  const now = new Date().toISOString();
  const id = generateAccountId();

  const account: Account = {
    id,
    name,
    type,
    opening_balance,
    created_at: now,
    updated_at: now,
  };

  await db.runAsync(
    `INSERT INTO accounts (id, name, type, opening_balance, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, type, opening_balance, now, now]
  );

  return account;
}

export async function getAllAccounts(): Promise<Account[]> {
  const db = databaseService.getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM accounts ORDER BY created_at DESC`
  );
  return (result || []) as Account[];
}