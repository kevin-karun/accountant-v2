import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { createTransaction, updateTransaction, deleteTransaction } from '../database/transactionsService';
import { getAllAccounts } from '../database/accountsService';
import { Account, Transaction } from '../database/types';

type AddTransactionRouteParams = {
  mode?: 'create' | 'edit';
  transaction?: Transaction;
  returnTo?: 'Transactions' | 'Dashboard';
};

export default function AddTransactionScreen() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [returnToScreen, setReturnToScreen] = useState<'Transactions' | 'Dashboard' | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const params = (route.params as AddTransactionRouteParams | undefined) ?? {};

  const loadAccounts = useCallback(async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data);
      if (data.length > 0 && !selectedAccountId) {
        setSelectedAccountId(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
      Alert.alert('Error', 'Failed to load accounts');
    }
  }, [selectedAccountId]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (params.mode === 'edit' && params.transaction) {
      setMode('edit');
      setEditingTransactionId(params.transaction.id);
      setReturnToScreen(params.returnTo ?? null);
      setSelectedAccountId(params.transaction.account_id);
      setType(params.transaction.type === 'income' ? 'income' : 'expense');
      setAmount(params.transaction.amount.toString());
      setDescription(params.transaction.description ?? '');
      setDate(params.transaction.date);
      setErrors({});
      setSuccessMessage('');
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      navigation.setParams({
        mode: 'create',
        transaction: undefined,
        returnTo: undefined,
      });
    }
  }, [navigation, params.mode, params.returnTo, params.transaction]);

  const resetForm = useCallback(() => {
    setMode('create');
    setEditingTransactionId(null);
    setReturnToScreen(null);
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setErrors({});
    setSuccessMessage('');
  }, []);

  const navigateAfterEdit = useCallback(() => {
    resetForm();

    if (returnToScreen) {
      navigation.navigate(returnToScreen);
      return;
    }

    navigation.navigate('Transactions');
  }, [navigation, resetForm, returnToScreen]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (mode === 'edit') {
          resetForm();
        }
      };
    }, [mode, resetForm])
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedAccountId) {
      newErrors.account = 'Please select an account';
    }

    if (amount.trim() === '' || isNaN(parseFloat(amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!date.trim()) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTransaction = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await createTransaction(
        selectedAccountId,
        type,
        parseFloat(amount),
        description,
        date
      );

      resetForm();
      setSuccessMessage('Transaction created successfully');
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } catch (error) {
      console.error('Failed to create transaction:', error);
      Alert.alert('Error', 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = async () => {
    if (!editingTransactionId || !validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await updateTransaction(editingTransactionId, {
        account_id: selectedAccountId,
        type,
        amount: parseFloat(amount),
        description,
        date,
      });

      navigateAfterEdit();
    } catch (error) {
      console.error('Failed to update transaction:', error);
      Alert.alert('Error', 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = () => {
    if (!editingTransactionId) {
      return;
    }

    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteTransaction(editingTransactionId);
              navigateAfterEdit();
            } catch (error) {
              console.error('Failed to delete transaction:', error);
              Alert.alert('Error', 'Failed to delete transaction');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>{mode === 'edit' ? 'Edit Transaction' : 'Add Transaction'}</Text>
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Account</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={selectedAccountId}
              onValueChange={(itemValue) => {
                setSelectedAccountId(itemValue);
                setSuccessMessage('');
              }}
              enabled={!loading}
            >
              {accounts.map((account) => (
                <Picker.Item
                  key={account.id}
                  label={`${account.name} (${account.type.replace('_', ' ')})`}
                  value={account.id}
                />
              ))}
            </Picker>
          </View>
          {errors.account && <Text style={styles.errorText}>{errors.account}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={type}
              onValueChange={(itemValue) => {
                setType(itemValue as 'income' | 'expense');
                setSuccessMessage('');
              }}
              enabled={!loading}
            >
              <Picker.Item label="Income" value="income" />
              <Picker.Item label="Expense" value="expense" />
            </Picker>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            value={amount}
            onChangeText={(value) => {
              setAmount(value);
              setSuccessMessage('');
            }}
            keyboardType="decimal-pad"
            editable={!loading}
            placeholderTextColor="#999"
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Transaction description"
            value={description}
            onChangeText={(value) => {
              setDescription(value);
              setSuccessMessage('');
            }}
            editable={!loading}
            placeholderTextColor="#999"
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={(value) => {
              setDate(value);
              setSuccessMessage('');
            }}
            editable={!loading}
            placeholderTextColor="#999"
          />
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={mode === 'edit' ? handleSaveTransaction : handleCreateTransaction}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === 'edit' ? 'Save Changes' : 'Add Transaction'}
            </Text>
          )}
        </TouchableOpacity>

        {mode === 'edit' ? (
          <TouchableOpacity
            style={[styles.deleteButton, loading && styles.buttonDisabled]}
            onPress={handleDeleteTransaction}
            disabled={loading}
          >
            <Text style={styles.deleteButtonText}>Delete Transaction</Text>
          </TouchableOpacity>
        ) : null}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  successText: {
    color: '#2f855a',
    fontSize: 14,
    marginBottom: 12,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  picker: {
    minHeight: 44,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#b3b3b3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
});
