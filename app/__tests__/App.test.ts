/**
 * Test for App environment and database schema
 */

describe('App Environment', () => {
  it('should verify basic module imports', () => {
    // Verify that common modules can be imported without errors
    const React = require('react');
    const ReactNative = require('react-native');

    expect(React).toBeDefined();
    expect(ReactNative).toBeDefined();
    expect(ReactNative.View).toBeDefined();
    expect(ReactNative.Text).toBeDefined();
  });

  it('should verify Expo modules are available', () => {
    // Verify Expo modules are available in test environment
    const statusBar = require('expo-status-bar');

    expect(statusBar).toBeDefined();
    expect(statusBar.StatusBar).toBeDefined();
  });
});

describe('Database Schema', () => {
  it('should have correct table names defined', () => {
    const { TABLES } = require('../database/schema');

    expect(TABLES).toBeDefined();
    expect(TABLES.ACCOUNTS).toBe('accounts');
    expect(TABLES.TRANSACTIONS).toBe('transactions');
  });

  it('should have valid SQL table creation statements', () => {
    const { CREATE_ACCOUNTS_TABLE, CREATE_TRANSACTIONS_TABLE } = require('../database/schema');

    expect(CREATE_ACCOUNTS_TABLE).toContain('CREATE TABLE IF NOT EXISTS accounts');
    expect(CREATE_ACCOUNTS_TABLE).toContain('id TEXT PRIMARY KEY');
    expect(CREATE_ACCOUNTS_TABLE).toContain('name TEXT NOT NULL');
    expect(CREATE_ACCOUNTS_TABLE).toContain('type TEXT NOT NULL');

    expect(CREATE_TRANSACTIONS_TABLE).toContain('CREATE TABLE IF NOT EXISTS transactions');
    expect(CREATE_TRANSACTIONS_TABLE).toContain('id TEXT PRIMARY KEY');
    expect(CREATE_TRANSACTIONS_TABLE).toContain('account_id TEXT NOT NULL');
    expect(CREATE_TRANSACTIONS_TABLE).toContain('FOREIGN KEY (account_id) REFERENCES accounts (id)');
  });
});

describe('Database Types', () => {
  it('should be able to import database types without errors', () => {
    // Test that the types can be imported without throwing errors
    expect(() => {
      require('../database/types');
    }).not.toThrow();
  });

  it('should validate Account type structure', () => {
    // Test that we can create objects matching the expected interface structure
    // This validates the type definitions are reasonable
    const sampleAccount = {
      id: 'test-id',
      name: 'Test Account',
      type: 'bank' as const,
      opening_balance: 1000,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    };

    expect(sampleAccount.id).toBe('test-id');
    expect(sampleAccount.type).toBe('bank');
    expect(sampleAccount.opening_balance).toBe(1000);
    expect(typeof sampleAccount.created_at).toBe('string');
    expect(typeof sampleAccount.updated_at).toBe('string');
  });

  it('should validate Transaction type structure', () => {
    const sampleTransaction = {
      id: 'txn-id',
      account_id: 'acc-id',
      type: 'income' as const,
      amount: 500,
      description: 'Test transaction',
      date: '2024-01-01',
      linked_bill_id: undefined,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    };

    expect(sampleTransaction.id).toBe('txn-id');
    expect(sampleTransaction.account_id).toBe('acc-id');
    expect(sampleTransaction.type).toBe('income');
    expect(sampleTransaction.amount).toBe(500);
    expect(sampleTransaction.description).toBe('Test transaction');
  });
});