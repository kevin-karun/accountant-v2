import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { createBill, getAllBills, markBillAsPaid } from '../database/billsService';
import { Bill } from '../database/types';
import { formatDisplayDate } from '../utils/date';

function formatStorageDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseStorageDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

function sanitizeAmountInput(value: string) {
  const digitsAndDotsOnly = value.replace(/[^0-9.]/g, '');
  const [integerPart = '', ...decimalParts] = digitsAndDotsOnly.split('.');

  if (decimalParts.length === 0) {
    return digitsAndDotsOnly;
  }

  return `${integerPart}.${decimalParts.join('')}`;
}

function isValidAmountValue(value: string) {
  return value.trim() !== '' && !isNaN(parseFloat(value)) && parseFloat(value) > 0;
}

function normalizeBillName(value: string) {
  return value.trim().toLowerCase();
}

function sortBillsByDueDate(items: Bill[]) {
  return [...items].sort((left, right) => left.due_date.localeCompare(right.due_date));
}

function getDayDifference(firstDate: string, secondDate: string) {
  const first = parseStorageDate(firstDate).getTime();
  const second = parseStorageDate(secondDate).getTime();
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.abs(first - second) / millisecondsPerDay;
}

export default function BillsScreen() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(formatStorageDate(new Date()));
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly'>('monthly');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPossibleDuplicateConfirmation, setShowPossibleDuplicateConfirmation] = useState(false);

  const loadBills = useCallback(async () => {
    try {
      const data = await getAllBills();
      setBills(data);
    } catch (error) {
      console.error('Failed to load bills:', error);
      Alert.alert('Error', 'Failed to load bills');
    }
  }, []);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  useFocusEffect(
    useCallback(() => {
      loadBills();
    }, [loadBills])
  );

  const resetForm = () => {
    setName('');
    setAmount('');
    setDueDate(formatStorageDate(new Date()));
    setIsRecurring(false);
    setRecurrenceFrequency('monthly');
    setShowDatePicker(false);
    setErrors({});
    setShowPossibleDuplicateConfirmation(false);
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = 'Bill name is required';
    }

    if (!isValidAmountValue(amount)) {
      nextErrors.amount = 'Amount must be a valid number';
    }

    if (!dueDate.trim() || Number.isNaN(parseStorageDate(dueDate).getTime())) {
      nextErrors.dueDate = 'Due date is required';
    }

    if (isRecurring && !recurrenceFrequency) {
      nextErrors.recurrence = 'Recurrence frequency is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const createBillRecord = async () => {
    setLoading(true);
    try {
      await createBill(name.trim(), parseFloat(amount), dueDate, {
        isRecurring,
        recurrenceFrequency: isRecurring ? recurrenceFrequency : null,
      });
      resetForm();
      setSuccessMessage('Bill created successfully');
      await loadBills();
    } catch (error) {
      console.error('Failed to create bill:', error);
      Alert.alert('Error', 'Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBill = async () => {
    if (!validateForm()) {
      return;
    }

    const normalizedName = normalizeBillName(name);
    const parsedAmount = parseFloat(amount);
    const matchingNameBills = bills.filter((bill) => {
      return normalizeBillName(bill.name) === normalizedName;
    });
    const nearbyMatchingNameBills = matchingNameBills.filter((bill) => {
      return getDayDifference(bill.due_date, dueDate) <= 3;
    });

    const exactDuplicate = matchingNameBills.find((bill) => {
      return bill.due_date === dueDate && bill.amount === parsedAmount;
    });

    if (exactDuplicate) {
      setShowPossibleDuplicateConfirmation(false);
      setErrors((currentErrors) => ({
        ...currentErrors,
        name: 'A bill with this name, amount, and due date already exists',
      }));
      return;
    }

    if (nearbyMatchingNameBills.length > 0) {
      setShowPossibleDuplicateConfirmation(true);
      return;
    }

    setShowPossibleDuplicateConfirmation(false);
    await createBillRecord();
  };

  const handleMarkPaid = async (billId: string) => {
    setLoading(true);
    try {
      await markBillAsPaid(billId);
      setSuccessMessage('Bill marked as paid');
      await loadBills();
    } catch (error) {
      console.error('Failed to mark bill as paid:', error);
      Alert.alert('Error', 'Failed to update bill');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    setDueDate(formatStorageDate(selectedDate));
    setSuccessMessage('');
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatRecurrence = (bill: Bill) => {
    if (!bill.is_recurring || !bill.recurrence_frequency) {
      return 'One-time bill';
    }

    if (bill.recurrence_frequency === 'weekly') {
      return 'Recurring · Weekly';
    }

    if (bill.recurrence_frequency === 'bi-weekly') {
      return 'Recurring · Bi-weekly';
    }

    return 'Recurring · Monthly';
  };
  const pendingBills = sortBillsByDueDate(
    bills.filter((bill) => bill.status === 'pending')
  );
  const paidBills = sortBillsByDueDate(
    bills.filter((bill) => bill.status === 'paid')
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Bills</Text>
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Create New Bill</Text>
        <TextInput
          style={styles.input}
          placeholder="Bill name"
          value={name}
          onChangeText={(value) => {
            setName(value);
            setSuccessMessage('');
            setShowPossibleDuplicateConfirmation(false);
          }}
          editable={!loading}
          placeholderTextColor="#999"
        />
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={(value) => {
            const sanitizedValue = sanitizeAmountInput(value);
            const attemptedInvalidCharacters = value !== sanitizedValue;

            setAmount(sanitizedValue);
            setSuccessMessage('');
            setShowPossibleDuplicateConfirmation(false);

            setErrors((currentErrors) => {
              if (isValidAmountValue(sanitizedValue)) {
                const { amount: _amountError, ...remainingErrors } = currentErrors;
                return remainingErrors;
              }

              if (attemptedInvalidCharacters) {
                return {
                  ...currentErrors,
                  amount: 'Amount must contain numbers only',
                };
              }

              return currentErrors;
            });
          }}
          keyboardType="decimal-pad"
          editable={!loading}
          placeholderTextColor="#999"
        />
        {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}

        <TouchableOpacity
          style={[styles.input, styles.dateInput, loading && styles.buttonDisabled]}
          onPress={() => {
            setShowDatePicker(true);
            setSuccessMessage('');
            setShowPossibleDuplicateConfirmation(false);
          }}
          disabled={loading}
        >
          <Text style={styles.dateInputText}>{formatDisplayDate(dueDate)}</Text>
        </TouchableOpacity>
        {errors.dueDate ? <Text style={styles.errorText}>{errors.dueDate}</Text> : null}
        {showDatePicker ? (
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={parseStorageDate(dueDate)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={styles.datePickerDoneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerDoneButtonText}>Done</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Recurrence</Text>
          <View style={styles.frequencyRow}>
            <TouchableOpacity
              style={[
                styles.frequencyButton,
                !isRecurring && styles.frequencyButtonSelected,
              ]}
              onPress={() => {
                setIsRecurring(false);
                setSuccessMessage('');
                setShowPossibleDuplicateConfirmation(false);
                setErrors((currentErrors) => {
                  const { recurrence: _recurrenceError, ...remainingErrors } = currentErrors;
                  return remainingErrors;
                });
              }}
              disabled={loading}
            >
              <Text
                style={[
                  styles.frequencyButtonText,
                  !isRecurring && styles.frequencyButtonTextSelected,
                ]}
              >
                One-time
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.frequencyButton,
                isRecurring && styles.frequencyButtonSelected,
              ]}
              onPress={() => {
                setIsRecurring(true);
                setSuccessMessage('');
                setShowPossibleDuplicateConfirmation(false);
              }}
              disabled={loading}
            >
              <Text
                style={[
                  styles.frequencyButtonText,
                  isRecurring && styles.frequencyButtonTextSelected,
                ]}
              >
                Recurring
              </Text>
            </TouchableOpacity>
          </View>
          {isRecurring ? (
            <View style={styles.frequencyRow}>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  recurrenceFrequency === 'weekly' && styles.frequencyButtonSelected,
                ]}
                onPress={() => {
                  setRecurrenceFrequency('weekly');
                  setSuccessMessage('');
                  setShowPossibleDuplicateConfirmation(false);
                  setErrors((currentErrors) => {
                    const { recurrence: _recurrenceError, ...remainingErrors } = currentErrors;
                    return remainingErrors;
                  });
                }}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    recurrenceFrequency === 'weekly' && styles.frequencyButtonTextSelected,
                  ]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  recurrenceFrequency === 'bi-weekly' && styles.frequencyButtonSelected,
                ]}
                onPress={() => {
                  setRecurrenceFrequency('bi-weekly');
                  setSuccessMessage('');
                  setShowPossibleDuplicateConfirmation(false);
                  setErrors((currentErrors) => {
                    const { recurrence: _recurrenceError, ...remainingErrors } = currentErrors;
                    return remainingErrors;
                  });
                }}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    recurrenceFrequency === 'bi-weekly' && styles.frequencyButtonTextSelected,
                  ]}
                >
                  Bi-weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  recurrenceFrequency === 'monthly' && styles.frequencyButtonSelected,
                ]}
                onPress={() => {
                  setRecurrenceFrequency('monthly');
                  setSuccessMessage('');
                  setShowPossibleDuplicateConfirmation(false);
                  setErrors((currentErrors) => {
                    const { recurrence: _recurrenceError, ...remainingErrors } = currentErrors;
                    return remainingErrors;
                  });
                }}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.frequencyButtonText,
                    recurrenceFrequency === 'monthly' && styles.frequencyButtonTextSelected,
                  ]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {errors.recurrence ? <Text style={styles.errorText}>{errors.recurrence}</Text> : null}
        </View>

        {showPossibleDuplicateConfirmation ? (
          <View style={styles.duplicateWarningCard}>
            <Text style={styles.duplicateWarningTitle}>Possible duplicate bill</Text>
            <Text style={styles.duplicateWarningText}>
              A bill with this name and a nearby due date already exists. You can still create this bill if it is intentional.
            </Text>
            <View style={styles.duplicateWarningActions}>
              <TouchableOpacity
                style={[styles.secondaryButton, styles.duplicateWarningButton, loading && styles.buttonDisabled]}
                onPress={() => setShowPossibleDuplicateConfirmation(false)}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.duplicateWarningButton, loading && styles.buttonDisabled]}
                onPress={() => {
                  setShowPossibleDuplicateConfirmation(false);
                  void createBillRecord();
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Create Anyway</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.button, (loading || showPossibleDuplicateConfirmation) && styles.buttonDisabled]}
          onPress={handleCreateBill}
          disabled={loading || showPossibleDuplicateConfirmation}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Bill</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Upcoming Bills</Text>
        {pendingBills.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No upcoming bills yet</Text>
            <Text style={styles.emptyText}>
              Create a bill above to keep upcoming expenses visible.
            </Text>
          </View>
        ) : (
          pendingBills.map((bill) => (
            <View key={bill.id} style={styles.billCard}>
              <View style={styles.billHeader}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billAmount}>{formatCurrency(bill.amount)}</Text>
              </View>
              <Text style={styles.billMeta}>Due {formatDisplayDate(bill.due_date)}</Text>
              <Text style={styles.billMeta}>{formatRecurrence(bill)}</Text>
              <TouchableOpacity
                style={[styles.secondaryButton, loading && styles.buttonDisabled]}
                onPress={() => handleMarkPaid(bill.id)}
                disabled={loading}
              >
                <Text style={styles.secondaryButtonText}>Mark as Paid</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Paid Bills</Text>
        {paidBills.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No paid bills yet</Text>
            <Text style={styles.emptyText}>
              Paid bills will appear here once you mark them as paid.
            </Text>
          </View>
        ) : (
          paidBills.map((bill) => (
            <View key={bill.id} style={styles.billCard}>
              <View style={styles.billHeader}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billAmount}>{formatCurrency(bill.amount)}</Text>
              </View>
              <Text style={styles.billMeta}>{formatRecurrence(bill)}</Text>
              <Text style={styles.billMeta}>
                Paid {bill.paid_at ? formatDisplayDate(formatStorageDate(new Date(bill.paid_at))) : 'recently'}
              </Text>
            </View>
          ))
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateInputText: {
    fontSize: 16,
    color: '#333',
  },
  datePickerContainer: {
    marginTop: -4,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingTop: 8,
  },
  datePickerDoneButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  datePickerDoneButtonText: {
    color: '#0066cc',
    fontSize: 15,
    fontWeight: '600',
  },
  frequencyRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  frequencyButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#c8c8c8',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  frequencyButtonSelected: {
    borderColor: '#0066cc',
    backgroundColor: '#eaf3ff',
  },
  frequencyButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  frequencyButtonTextSelected: {
    color: '#0066cc',
  },
  duplicateWarningCard: {
    backgroundColor: '#fff7e6',
    borderWidth: 1,
    borderColor: '#f5c26b',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  duplicateWarningTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8a5a00',
    marginBottom: 6,
  },
  duplicateWarningText: {
    fontSize: 14,
    color: '#7a652f',
    lineHeight: 20,
  },
  duplicateWarningActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  duplicateWarningButton: {
    flex: 1,
    marginTop: 0,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#28a745',
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#28a745',
    fontSize: 15,
    fontWeight: '600',
  },
  listSection: {
    marginBottom: 18,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
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
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  billName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  billAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
  },
  billMeta: {
    fontSize: 13,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: -4,
    marginBottom: 8,
  },
  successText: {
    color: '#2d8a26',
    fontSize: 14,
    marginBottom: 12,
  },
});
