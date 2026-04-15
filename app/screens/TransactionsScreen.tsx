import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllTransactions } from '../database/transactionsService';
import { getAllAccounts } from '../database/accountsService';
import { Transaction, Account } from '../database/types';

export default function TransactionsScreen() {
  const navigation = useNavigation<any>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [transactionsData, accountsData] = await Promise.all([
        getAllTransactions(),
        getAllAccounts(),
      ]);

      console.log('TransactionsScreen loadData result:', {
        count: transactionsData.length,
        firstThree: transactionsData.slice(0, 3),
      });

      setTransactions(transactionsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('Error', 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const getAccountLabel = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);

    if (!account) {
      return 'Unknown Account';
    }

    return `${account.name} · ${account.type.replace('_', ' ')}`;
  };

  const getTransactionTitle = (transaction: Transaction) => {
    const trimmedDescription = transaction.description?.trim();
    if (trimmedDescription) {
      return trimmedDescription;
    }

    return transaction.type === 'income' ? 'Income' : 'Expense';
  };

  const formatSignedCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`;
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() =>
        navigation.navigate('Add Transaction', {
          mode: 'edit',
          transaction: item,
          returnTo: 'Transactions',
        })
      }
    >
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionTitle}>{getTransactionTitle(item)}</Text>
        <Text style={[styles.amount, item.type === 'income' ? styles.income : styles.expense]}>
          {formatSignedCurrency(item.type === 'income' ? item.amount : -item.amount)}
        </Text>
      </View>
      <Text style={styles.accountLabel}>{getAccountLabel(item.account_id)}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.emptySubtext}>Add your first transaction using the Add tab</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    padding: 16,
    paddingBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  income: {
    color: '#28a745',
  },
  expense: {
    color: '#dc3545',
  },
  accountLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
