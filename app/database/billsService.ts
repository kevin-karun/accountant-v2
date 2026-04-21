import { databaseService } from './index';
import { Bill } from './types';

function generateBillId(): string {
  const random = Math.random().toString(36).substring(2, 9);
  return `bill_${Date.now()}_${random}`;
}

export async function createBill(
  name: string,
  amount: number,
  dueDate: string,
  options?: {
    isRecurring?: boolean;
    recurrenceFrequency?: 'weekly' | 'bi-weekly' | 'monthly' | null;
  }
): Promise<Bill> {
  const db = databaseService.getDatabase();
  const now = new Date().toISOString();
  const id = generateBillId();

  const paidAt: string | null = null;
  const isRecurring = options?.isRecurring ?? false;
  const recurrenceFrequency = isRecurring
    ? options?.recurrenceFrequency ?? null
    : null;

  const bill: Bill = {
    id,
    name,
    amount,
    due_date: dueDate,
    status: 'pending',
    is_recurring: isRecurring,
    recurrence_frequency: recurrenceFrequency,
    paid_at: paidAt,
    created_at: now,
    updated_at: now,
  };

  await db.runAsync(
    `INSERT INTO bills (
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
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      name,
      amount,
      dueDate,
      bill.status,
      isRecurring ? 1 : 0,
      recurrenceFrequency,
      paidAt,
      now,
      now,
    ]
  );

  return bill;
}

export async function getAllBills(): Promise<Bill[]> {
  const db = databaseService.getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM bills
     ORDER BY
       CASE WHEN status = 'pending' THEN 0 ELSE 1 END,
       due_date ASC,
       created_at DESC`
  );

  return ((result || []) as any[]).map((bill) => ({
    ...bill,
    is_recurring: Boolean(bill.is_recurring),
    recurrence_frequency: bill.recurrence_frequency ?? null,
  })) as Bill[];
}

export async function getPendingBills(): Promise<Bill[]> {
  const db = databaseService.getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM bills
     WHERE status = 'pending'
     ORDER BY due_date ASC, created_at ASC`
  );

  return ((result || []) as any[]).map((bill) => ({
    ...bill,
    is_recurring: Boolean(bill.is_recurring),
    recurrence_frequency: bill.recurrence_frequency ?? null,
  })) as Bill[];
}

export async function markBillAsPaid(id: string): Promise<void> {
  const db = databaseService.getDatabase();
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE bills
     SET status = ?, paid_at = ?, updated_at = ?
     WHERE id = ?`,
    ['paid', now, now, id]
  );
}
