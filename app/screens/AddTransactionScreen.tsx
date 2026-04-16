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

  const handleAccountChange = useCallback((accountId: string) => {
    console.log('AddTransactionScreen account selection changed:', accountId);
    setSelectedAccountId(accountId);
    setSuccessMessage('');
  }, []);

  const loadAccounts = useCallback(async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data);
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
      console.log('AddTransactionScreen entering edit mode with transaction:', {
        id: params.transaction.id,
        account_id: params.transaction.account_id,
        type: params.transaction.type,
        amount: params.transaction.amount,
        description: params.transaction.description,
        date: params.transaction.date,
      });
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

  useEffect(() => {
    if (mode === 'create' && selectedAccountId === '' && accounts.length === 1) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, mode, selectedAccountId]);

  const resetForm = useCallback(() => {
    setMode('create');
    setEditingTransactionId(null);
    setReturnToScreen(null);
    setSelectedAccountId('');
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

  const handleExitEditMode = useCallback(() => {
    navigateAfterEdit();
  }, [navigateAfterEdit]);

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });

      return () => {
        if (mode === 'edit') {
          resetForm();
        }
      };
    }, [loadAccounts, mode, resetForm])
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedAccountId) {
      console.log('BLOCKED: missing accountId');
      newErrors.account = 'Please select an account';
    }

    if (amount.trim() === '' || isNaN(parseFloat(amount))) {
      console.log('BLOCKED: missing amount');
      newErrors.amount = 'Amount must be a valid number';
    }

    if (!description.trim()) {
      console.log('BLOCKED: missing description');
      newErrors.description = 'Description is required';
    }

    if (!date.trim()) {
      console.log('BLOCKED: missing date');
      newErrors.date = 'Date is required';
    }

    const isValid = Object.keys(newErrors).length === 0;

    console.log('AddTransactionScreen validateForm:', {
      selectedAccountId,
      type,
      amount,
      description,
      date,
      errors: newErrors,
      isValid,
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateTransaction = async () => {
    console.log('ADD TRANSACTION SUBMIT PRESSED');
    console.log('SUBMIT BUTTON PRESSED');
    console.log('FORM STATE:', {
      accountId: selectedAccountId,
      type,
      amount,
      description,
    });

    const isValid = validateForm();

    if (!isValid) {
      console.log('AddTransactionScreen submit blocked by validation');
      return;
    }

    console.log('PASSING VALIDATION → creating transaction');
    console.log('AddTransactionScreen submit selectedAccountId:', selectedAccountId);
    console.log('AddTransactionScreen create payload:', {
      accountId: selectedAccountId,
      type,
      amount: parseFloat(amount),
      description,
      date,
    });

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
    console.log('EDIT TRANSACTION SUBMIT PRESSED');
    console.log('AddTransactionScreen edit form state:', {
      editingTransactionId,
      accountId: selectedAccountId,
      type,
      amount,
      description,
      date,
    });

    if (!editingTransactionId) {
      console.log('AddTransactionScreen edit blocked: missing editingTransactionId');
      return;
    }

    if (!validateForm()) {
      console.log('AddTransactionScreen edit blocked by validation');
      return;
    }

    setLoading(true);
    try {
      const updatePayload = {
        account_id: selectedAccountId,
        type,
        amount: parseFloat(amount),
        description,
        date,
      };

      console.log('AddTransactionScreen edit payload:', updatePayload);

      await updateTransaction(editingTransactionId, updatePayload);

      console.log('AddTransactionScreen updateTransaction completed:', {
        editingTransactionId,
      });

      console.log('AddTransactionScreen navigating after edit to:', returnToScreen ?? 'Transactions');
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
              testID="account-picker"
              accessibilityLabel="account-picker"
              style={styles.picker}
              selectedValue={selectedAccountId}
              onValueChange={(itemValue) => {
                handleAccountChange(itemValue);
              }}
              enabled={!loading}
          >
            <Picker.Item label="Select account" value="" />
            {accounts.map((account) => (
              <Picker.Item
                key={account.id}
                label={`${account.name} (${account.type.replace('_', ' ')})`}
                value={account.id}
                testID={
                  account.name === 'Smoke Account' && account.type === 'bank'
                    ? 'account-option-smoke-account'
                    : undefined
                }
                accessibilityLabel={
                  account.name === 'Smoke Account' && account.type === 'bank'
                    ? 'account-option-smoke-account'
                    : undefined
                }
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
            testID="add-transaction-amount-input"
            accessibilityLabel="add-transaction-amount-input"
            style={styles.input}
            placeholder="0.00"
            value={amount}
            onChangeText={(value) => {
              console.log('ADD TX AMOUNT CHANGED:', value);
              setAmount(value);
              setSuccessMessage('');
            }}
            keyboardType="decimal-pad"
            editable={!loading}
            placeholderTextColor="#999"
          />
          {errors.amount && (
            <Text
              testID="add-transaction-amount-error"
              accessibilityLabel="add-transaction-amount-error"
              style={styles.errorText}
            >
              {errors.amount}
            </Text>
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            testID={mode === 'edit' ? 'edit-transaction-description-input' : 'add-transaction-description-input'}
            accessibilityLabel={mode === 'edit' ? 'edit-transaction-description-input' : 'add-transaction-description-input'}
            style={styles.input}
            placeholder="Transaction description"
            value={description}
            onChangeText={(value) => {
              if (mode === 'edit') {
                console.log('EDIT TX DESCRIPTION CHANGED:', value);
              }
              console.log('ADD TX DESCRIPTION CHANGED:', value);
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

        {mode === 'edit' ? (
          <View style={styles.editActions}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                testID="edit-transaction-submit"
                accessibilityLabel="edit-transaction-submit"
                style={[styles.button, styles.buttonRowAction, styles.buttonFlex, styles.buttonSpacing, loading && styles.buttonDisabled]}
                onPress={handleSaveTransaction}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.buttonFlex, loading && styles.buttonDisabled]}
                onPress={handleExitEditMode}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              testID="edit-transaction-delete"
              accessibilityLabel="edit-transaction-delete"
              style={[styles.deleteButton, loading && styles.buttonDisabled]}
              onPress={handleDeleteTransaction}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>Delete Transaction</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            testID="add-transaction-submit"
            accessibilityLabel="add-transaction-submit"
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateTransaction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Transaction</Text>
            )}
          </TouchableOpacity>
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
  smokeHelperButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  smokeHelperButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
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
  editActions: {
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonRowAction: {
    marginTop: 0,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonSpacing: {
    marginRight: 8,
  },
  buttonDisabled: {
    backgroundColor: '#b3b3b3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c8c8c8',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
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
