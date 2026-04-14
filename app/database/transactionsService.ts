import { databaseService } from './index';
import { Transaction } from './types';

function generateTransactionId(): string {
  const random = Math.random().toString(36).substring(2, 9);
  return `txn_${Date.now()}_${random}`;
}

export async function createTransaction(
  accountId: string,
  type: 'income' | 'expense',
  amount: number,
  description: string,
  date: string
): Promise<Transaction> {
  const db = databaseService.getDatabase();
  const now = new Date().toISOString();
  const id = generateTransactionId();

  const transaction: Transaction = {
    id,
    account_id: accountId,
    type,
    amount,
    description,
    date,
    created_at: now,
    updated_at: now,
  };

  await db.runAsync(
    `INSERT INTO transactions (id, account_id, type, amount, description, date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, accountId, type, amount, description, date, now, now]
  );

  return transaction;
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const db = databaseService.getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM transactions ORDER BY date DESC, created_at DESC`
  );
  return (result || []) as Transaction[];
}

export async function getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
  const db = databaseService.getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM transactions WHERE account_id = ? ORDER BY date DESC, created_at DESC`,
    [accountId]
  );
  return (result || []) as Transaction[];
}

export async function deleteTransaction(transactionId: string): Promise<void> {
  const db = databaseService.getDatabase();
  await db.runAsync('DELETE FROM transactions WHERE id = ?', [transactionId]);
}