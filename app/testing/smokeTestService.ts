import {
  createAccount,
  deleteAccount,
  getAllAccounts,
  updateAccount,
} from '../database/accountsService';
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionsByAccount,
  updateTransaction,
} from '../database/transactionsService';
import { Account, Transaction } from '../database/types';

const SMOKE_ACCOUNT_NAME = 'Smoke Account';
const SMOKE_ACCOUNT_TYPE: Account['type'] = 'bank';
const SMOKE_ACCOUNT_OPENING_BALANCE = 100;
const SMOKE_TRANSACTION_AMOUNT = 25;
const SMOKE_TRANSACTION_DESCRIPTION = 'Smoke expense';
const SMOKE_TRANSACTION_UPDATED_DESCRIPTION = 'Smoke expense updated';
const SMOKE_INCOME_TRANSACTION_AMOUNT = 40;
const SMOKE_INCOME_TRANSACTION_DESCRIPTION = 'Smoke income';

function isSmokeTransaction(transaction: Transaction) {
  return (
    (
      transaction.type === 'expense'
      && transaction.amount === SMOKE_TRANSACTION_AMOUNT
      && (
        transaction.description === SMOKE_TRANSACTION_DESCRIPTION
        || transaction.description === SMOKE_TRANSACTION_UPDATED_DESCRIPTION
      )
    )
    || (
      transaction.type === 'income'
      && transaction.amount === SMOKE_INCOME_TRANSACTION_AMOUNT
      && transaction.description === SMOKE_INCOME_TRANSACTION_DESCRIPTION
    )
  );
}

async function ensureSingleSmokeAccount(): Promise<{ account: Account; created: boolean }> {
  const allAccounts = await getAllAccounts();
  const smokeAccounts = allAccounts.filter((account) => {
    return account.name.trim() === SMOKE_ACCOUNT_NAME;
  });

  if (smokeAccounts.length === 0) {
    const account = await createAccount(
      SMOKE_ACCOUNT_NAME,
      SMOKE_ACCOUNT_TYPE,
      SMOKE_ACCOUNT_OPENING_BALANCE
    );

    return { account, created: true };
  }

  const [primarySmokeAccount, ...duplicateSmokeAccounts] = smokeAccounts;

  if (
    primarySmokeAccount.type !== SMOKE_ACCOUNT_TYPE
    || primarySmokeAccount.opening_balance !== SMOKE_ACCOUNT_OPENING_BALANCE
  ) {
    await updateAccount(
      primarySmokeAccount.id,
      SMOKE_ACCOUNT_NAME,
      SMOKE_ACCOUNT_TYPE,
      SMOKE_ACCOUNT_OPENING_BALANCE
    );
  }

  for (const duplicateSmokeAccount of duplicateSmokeAccounts) {
    await deleteAccount(duplicateSmokeAccount.id);
  }

  return {
    account: {
      ...primarySmokeAccount,
      name: SMOKE_ACCOUNT_NAME,
      type: SMOKE_ACCOUNT_TYPE,
      opening_balance: SMOKE_ACCOUNT_OPENING_BALANCE,
    },
    created: false,
  };
}

async function getCanonicalSmokeTransaction(accountId: string): Promise<Transaction | null> {
  const transactions = await getTransactionsByAccount(accountId);
  const smokeTransactions = transactions.filter(isSmokeTransaction);

  if (smokeTransactions.length === 0) {
    return null;
  }

  const [primaryTransaction, ...duplicateTransactions] = smokeTransactions;

  for (const duplicateTransaction of duplicateTransactions) {
    await deleteTransaction(duplicateTransaction.id);
  }

  return primaryTransaction;
}

export async function resetSmokeState(): Promise<string> {
  const allTransactions = await getAllTransactions();
  const smokeTransactions = allTransactions.filter(isSmokeTransaction);

  for (const transaction of smokeTransactions) {
    await deleteTransaction(transaction.id);
  }

  await ensureSingleSmokeAccount();

  return 'Smoke state reset successfully';
}

export async function ensureSmokeAccount(): Promise<string> {
  const { created } = await ensureSingleSmokeAccount();
  return created
    ? 'Smoke account created successfully'
    : 'Smoke account already exists';
}

export async function ensureSmokeTransaction(): Promise<string> {
  const { account } = await ensureSingleSmokeAccount();
  const existingTransaction = await getCanonicalSmokeTransaction(account.id);

  if (existingTransaction) {
    if (existingTransaction.description !== SMOKE_TRANSACTION_DESCRIPTION) {
      await updateTransaction(existingTransaction.id, {
        account_id: account.id,
        type: 'expense',
        amount: SMOKE_TRANSACTION_AMOUNT,
        description: SMOKE_TRANSACTION_DESCRIPTION,
        date: existingTransaction.date,
      });
    }

    return 'Smoke expense already exists';
  }

  await createTransaction(
    account.id,
    'expense',
    SMOKE_TRANSACTION_AMOUNT,
    SMOKE_TRANSACTION_DESCRIPTION,
    new Date().toISOString().split('T')[0]
  );

  return 'Smoke expense created successfully';
}

export async function ensureSmokeIncomeTransaction(): Promise<string> {
  const { account } = await ensureSingleSmokeAccount();
  const transactions = await getTransactionsByAccount(account.id);
  const smokeIncomeTransactions = transactions.filter((transaction) => {
    return transaction.type === 'income'
      && transaction.amount === SMOKE_INCOME_TRANSACTION_AMOUNT
      && transaction.description === SMOKE_INCOME_TRANSACTION_DESCRIPTION;
  });

  if (smokeIncomeTransactions.length > 0) {
    const [, ...duplicateTransactions] = smokeIncomeTransactions;

    for (const duplicateTransaction of duplicateTransactions) {
      await deleteTransaction(duplicateTransaction.id);
    }

    return 'Smoke income already exists';
  }

  await createTransaction(
    account.id,
    'income',
    SMOKE_INCOME_TRANSACTION_AMOUNT,
    SMOKE_INCOME_TRANSACTION_DESCRIPTION,
    new Date().toISOString().split('T')[0]
  );

  return 'Smoke income created successfully';
}

export async function applySmokeTransactionUpdate(): Promise<string> {
  const { account } = await ensureSingleSmokeAccount();
  let smokeTransaction = await getCanonicalSmokeTransaction(account.id);

  if (!smokeTransaction) {
    await createTransaction(
      account.id,
      'expense',
      SMOKE_TRANSACTION_AMOUNT,
      SMOKE_TRANSACTION_DESCRIPTION,
      new Date().toISOString().split('T')[0]
    );

    smokeTransaction = await getCanonicalSmokeTransaction(account.id);
  }

  if (!smokeTransaction) {
    throw new Error('Smoke transaction could not be created');
  }

  if (smokeTransaction.description === SMOKE_TRANSACTION_UPDATED_DESCRIPTION) {
    return 'Smoke expense already updated';
  }

  await updateTransaction(smokeTransaction.id, {
    account_id: smokeTransaction.account_id,
    type: 'expense',
    amount: SMOKE_TRANSACTION_AMOUNT,
    description: SMOKE_TRANSACTION_UPDATED_DESCRIPTION,
    date: smokeTransaction.date,
  });

  return 'Smoke expense updated successfully';
}

export async function deleteSmokeTransaction(): Promise<string> {
  const allTransactions = await getAllTransactions();
  const smokeTransactions = allTransactions.filter(isSmokeTransaction);

  if (smokeTransactions.length === 0) {
    return 'Smoke transaction already deleted';
  }

  for (const transaction of smokeTransactions) {
    await deleteTransaction(transaction.id);
  }

  return 'Smoke transaction deleted successfully';
}
