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
import { Picker } from '@react-native-picker/picker';
import { createTransaction } from '../database/transactionsService';
import { getAllAccounts } from '../database/accountsService';
import { Account } from '../database/types';

export default function AddTransactionScreen() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

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

      // Reset form
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setType('expense');
      setErrors({});
      setSuccessMessage('Transaction created successfully');
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } catch (error) {
      console.error('Failed to create transaction:', error);
      Alert.alert('Error', 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Add Transaction</Text>
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
          onPress={handleCreateTransaction}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Transaction</Text>
          )}
        </TouchableOpacity>
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
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
});
