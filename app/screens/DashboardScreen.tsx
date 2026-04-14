import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllAccounts, getAccountBalance } from '../database/accountsService';
import { getAllTransactions } from '../database/transactionsService';
import { Account, Transaction } from '../database/types';

type AccountSummary = {
  account: Account;
  balance: number;
};

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [accountSummaries, setAccountSummaries] = useState<AccountSummary[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [weeklyNetChange, setWeeklyNetChange] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [accounts, transactions] = await Promise.all([
        getAllAccounts(),
        getAllTransactions(),
      ]);

      const balances = await Promise.all(
        accounts.map(account => getAccountBalance(account.id))
      );

      const summaries = accounts.map((account, index) => ({
        account,
        balance: balances[index],
      }));

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const netChangeLast7Days = transactions.reduce((sum, transaction) => {
        const transactionDate = new Date(transaction.date);

        if (transactionDate < sevenDaysAgo) {
          return sum;
        }

        if (transaction.type === 'income') {
          return sum + transaction.amount;
        }

        if (transaction.type === 'expense') {
          return sum - transaction.amount;
        }

        return sum;
      }, 0);

      setAccountSummaries(summaries);
      setRecentTransactions(transactions.slice(0, 3));
      setWeeklyNetChange(transactions.length > 0 ? netChangeLast7Days : null);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const totalBalance = accountSummaries.reduce(
    (sum, summary) => sum + summary.balance,
    0
  );
  const accountPreview = accountSummaries.slice(0, 3);

  const getAccountLabel = (accountId: string) => {
    const matchingAccount = accountSummaries.find(
      summary => summary.account.id === accountId
    );

    if (!matchingAccount) {
      return 'Unknown Account';
    }

    return `${matchingAccount.account.name} · ${matchingAccount.account.type.replace('_', ' ')}`;
  };

  const getTransactionTitle = (transaction: Transaction) => {
    const trimmedDescription = transaction.description?.trim();
    if (trimmedDescription) {
      return trimmedDescription;
    }

    return transaction.type === 'income' ? 'Income' : 'Expense';
  };

  const formatCurrency = (amount: number) => {
    return `${amount < 0 ? '-' : ''}$${Math.abs(amount).toFixed(2)}`;
  };

  const formatSignedCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Total Balance</Text>
        <Text style={styles.totalBalance}>{formatCurrency(totalBalance)}</Text>
        {weeklyNetChange !== null ? (
          <Text
            style={[
              styles.netChangeText,
              weeklyNetChange >= 0 ? styles.income : styles.expense,
            ]}
          >
            {formatSignedCurrency(weeklyNetChange)} (last 7 days)
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {recentTransactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptyText}>
              {accountSummaries.length === 0
                ? 'Create an account first, then add a transaction to see activity here.'
                : 'Add a transaction to start seeing recent activity here.'}
            </Text>
          </View>
        ) : (
          recentTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.listItem}
              onPress={() =>
                navigation.navigate('Add Transaction', {
                  mode: 'edit',
                  transaction,
                  returnTo: 'Dashboard',
                })
              }
            >
              <View style={styles.listItemHeader}>
                <Text style={styles.itemTitle}>
                  {getTransactionTitle(transaction)}
                </Text>
                <Text
                  style={[
                    styles.itemAmount,
                    transaction.type === 'income' ? styles.income : styles.expense,
                  ]}
                >
                  {formatSignedCurrency(transaction.type === 'income' ? transaction.amount : -transaction.amount)}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>
                {getAccountLabel(transaction.account_id)}
              </Text>
              <Text style={styles.itemMeta}>
                {new Date(transaction.date).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accounts</Text>
        {accountSummaries.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No accounts yet</Text>
            <Text style={styles.emptyText}>
              Create an account first to see balances on your dashboard.
            </Text>
          </View>
        ) : (
          <>
            {accountPreview.map(({ account, balance }) => (
              <View key={account.id} style={styles.listItem}>
                <View style={styles.listItemHeader}>
                  <Text style={styles.itemTitle}>
                    {account.name} · {account.type.replace('_', ' ')}
                  </Text>
                  <Text style={styles.itemAmount}>{formatCurrency(balance)}</Text>
                </View>
              </View>
            ))}
            <Text style={styles.helperText}>View all accounts in the Accounts tab</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  totalBalance: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  netChangeText: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: '#999',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  helperText: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
    marginLeft: 2,
  },
  income: {
    color: '#28a745',
  },
  expense: {
    color: '#dc3545',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
});
