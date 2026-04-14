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

export async function getAccountById(id: string): Promise<Account | null> {
  const db = databaseService.getDatabase();
  const result = await db.getFirstAsync(
    `SELECT * FROM accounts WHERE id = ?`,
    [id]
  );
  return result ? (result as Account) : null;
}

export async function updateAccount(
  id: string,
  name: string,
  type: 'bank' | 'credit_card' | 'cash' | 'other',
  opening_balance: number
): Promise<Account | null> {
  const db = databaseService.getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE accounts SET name = ?, type = ?, opening_balance = ?, updated_at = ? WHERE id = ?`,
    [name, type, opening_balance, now, id]
  );

  return getAccountById(id);
}

export async function deleteAccount(id: string): Promise<void> {
  const db = databaseService.getDatabase();
  await db.runAsync(
    `DELETE FROM accounts WHERE id = ?`,
    [id]
  );
}