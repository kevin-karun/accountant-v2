export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'credit_card' | 'cash' | 'other';
  opening_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  account_id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description?: string;
  date: string;
  linked_bill_id?: string;
  created_at: string;
  updated_at: string;
}