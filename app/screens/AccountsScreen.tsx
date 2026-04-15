import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { createAccount, getAllAccounts, updateAccount, deleteAccount, getAccountBalance } from '../database/accountsService';
import { Account } from '../database/types';

export default function AccountsScreen() {
  type AccountFormType = Account['type'] | '';
  const scrollViewRef = useRef<ScrollView | null>(null);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountFormType>('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const loadAccounts = useCallback(async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data);

      // Load balances for all accounts
      const balancePromises = data.map(account => getAccountBalance(account.id));
      const balanceResults = await Promise.all(balancePromises);
      const balanceMap: Record<string, number> = {};
      data.forEach((account, index) => {
        balanceMap[account.id] = balanceResults[index];
      });
      setBalances(balanceMap);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      Alert.alert('Error', 'Failed to load accounts');
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  const resetForm = () => {
    setName('');
    setBalance('');
    setType('');
    setEditingId(null);
    setTouchedFields({});
    setSuccessMessage('');
  };

  const getAccountFormErrors = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = name.trim();
    const normalizedName = trimmedName.toLowerCase();
    const hasName = trimmedName !== '';
    const hasType = !!type;
    const hasValidBalance = balance.trim() !== '' && !isNaN(parseFloat(balance));
    const tier1Complete = hasName && hasType;

    if (!hasName) {
      newErrors.name = 'Account name is required';
    }

    if (!hasType) {
      newErrors.type = 'Account type is required';
    }

    if (!hasValidBalance) {
      newErrors.balance = 'Opening balance must be a valid number';
    }

    if (tier1Complete && hasValidBalance) {
      const duplicate = accounts.find(account => {
        const sameName = account.name.trim().toLowerCase() === normalizedName;
        const sameType = account.type === type;
        const isSameRecord = editingId === account.id;
        return sameName && sameType && !isSameRecord;
      });

      if (duplicate) {
        newErrors.name = 'An account with this name and type already exists';
      }
    }

    return newErrors;
  };

  const validateAccountForm = () => {
    setTouchedFields({
      name: true,
      type: true,
      balance: true,
    });

    return Object.keys(getAccountFormErrors()).length === 0;
  };

  const isAccountFormValid = () => {
    return Object.keys(getAccountFormErrors()).length === 0;
  };

  const hasStartedAccountForm = name.trim() !== '' || balance.trim() !== '' || type !== '';
  const trimmedName = name.trim();
  const hasName = trimmedName !== '';
  const hasType = !!type;
  const tier1Complete = hasName && hasType;
  const balanceTouched = !!touchedFields.balance;
  const shouldShowNameError = !hasName && (touchedFields.name || hasStartedAccountForm);
  const shouldShowTypeError = hasName && !hasType && (touchedFields.type || hasStartedAccountForm);
  const accountFormErrors = getAccountFormErrors();
  const visibleAccountErrors: Record<string, string> = {};

  if (shouldShowNameError && accountFormErrors.name === 'Account name is required') {
    visibleAccountErrors.name = accountFormErrors.name;
  } else if (shouldShowTypeError && accountFormErrors.type) {
    visibleAccountErrors.type = accountFormErrors.type;
  } else if ((balanceTouched || tier1Complete) && accountFormErrors.balance) {
    visibleAccountErrors.balance = accountFormErrors.balance;
  } else if (tier1Complete && !accountFormErrors.balance && accountFormErrors.name) {
    visibleAccountErrors.name = accountFormErrors.name;
  }

  const handleCreateAccount = async () => {
    if (!validateAccountForm()) {
      return;
    }

    setLoading(true);
    try {
      await createAccount(name.trim(), type as Account['type'], parseFloat(balance));
      resetForm();
      await loadAccounts();
      setSuccessMessage('Account created successfully');
    } catch (error) {
      console.error('Failed to create account:', error);
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = async () => {
    if (!editingId) return;

    if (!validateAccountForm()) {
      return;
    }

    setLoading(true);
    try {
      await updateAccount(editingId, name.trim(), type as Account['type'], parseFloat(balance));
      resetForm();
      await loadAccounts();
      setSuccessMessage('Account updated successfully');
    } catch (error) {
      console.error('Failed to update account:', error);
      Alert.alert('Error', 'Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!editingId) return;

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account? This cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteAccount(editingId);
              resetForm();
              await loadAccounts();
              Alert.alert('Success', 'Account deleted successfully');
            } catch (error) {
              console.error('Failed to delete account:', error);
              Alert.alert('Error', 'Failed to delete account');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const startEditing = (account: Account) => {
    setEditingId(account.id);
    setName(account.name);
    setType(account.type);
    setBalance(account.opening_balance.toString());
    setTouchedFields({});
    setSuccessMessage('');
  };

  const handleAccountTypeChange = (value: AccountFormType) => {
    console.log('ACCOUNT TYPE SET:', value);
    setType(value);
    setSuccessMessage('');
    setTouchedFields(prev => ({ ...prev, type: true }));
  };

  const handleCreateSmokeAccount = async () => {
    const existingSmokeAccount = accounts.find(account => {
      return account.name.trim().toLowerCase() === 'smoke account' && account.type === 'bank';
    });

    if (existingSmokeAccount) {
      setSuccessMessage('Smoke account already exists');
      return;
    }

    setLoading(true);
    try {
      await createAccount('Smoke Account', 'bank', 100);
      await loadAccounts();
      setSuccessMessage('Smoke account created successfully');
    } catch (error) {
      console.error('Failed to create smoke account:', error);
      Alert.alert('Error', 'Failed to create smoke account');
    } finally {
      setLoading(false);
    }
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={[
        styles.accountItem,
        editingId === item.id && styles.accountItemActive,
      ]}
      onPress={() => startEditing(item)}
    >
      <Text style={styles.accountName}>{item.name}</Text>
      <Text style={styles.accountType}>{item.type.replace('_', ' ')}</Text>
      <Text style={styles.accountBalance}>${(balances[item.id] || item.opening_balance).toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Accounts</Text>
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      {/* Form Section */}
      <View style={[styles.formSection, editingId && styles.formSectionEditing]}>
        <View style={styles.formHeader}>
          <Text style={styles.sectionTitle}>
            {editingId ? 'Edit Account' : 'Create New Account'}
          </Text>
          {editingId && <View style={styles.editBadge}><Text style={styles.editBadgeText}>EDITING</Text></View>}
          {editingId && (
            <TouchableOpacity
              style={styles.newAccountButton}
              onPress={resetForm}
            >
              <Text style={styles.newAccountButtonText}>New Account</Text>
            </TouchableOpacity>
          )}
        </View>
        {__DEV__ ? (
          <View style={styles.automationRow}>
            <TouchableOpacity
              testID="create-smoke-account"
              accessibilityLabel="create-smoke-account"
              style={[styles.automationButton, styles.automationButtonSpacing]}
              onPress={handleCreateSmokeAccount}
            >
              <Text style={styles.automationButtonText}>Create Smoke Bank Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="account-type-option-bank"
              accessibilityLabel="account-type-option-bank"
              style={[styles.automationButton, styles.automationButtonSpacing]}
              onPress={() => handleAccountTypeChange('bank')}
            >
              <Text style={styles.automationButtonText}>Set Bank</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="account-type-option-cash"
              accessibilityLabel="account-type-option-cash"
              style={styles.automationButton}
              onPress={() => handleAccountTypeChange('cash')}
            >
              <Text style={styles.automationButtonText}>Set Cash</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <TextInput
          accessibilityLabel="account-name-input"
          testID="account-name-input"
          style={styles.input}
          placeholder="Account name"
          value={name}
          onChangeText={(value) => {
            setName(value);
            setSuccessMessage('');
            setTouchedFields(prev => ({ ...prev, name: true }));
          }}
          editable={!loading}
          placeholderTextColor="#999"
        />
        {visibleAccountErrors.name && <Text style={styles.errorText}>{visibleAccountErrors.name}</Text>}

        <View style={styles.pickerWrapper}>
          <Picker
            testID="account-type-picker"
            accessibilityLabel="account-type-picker"
            style={styles.picker}
            selectedValue={type}
            onValueChange={(itemValue) => {
              handleAccountTypeChange(itemValue as AccountFormType);
            }}
            enabled={!loading}
          >
            <Picker.Item label="Select account type" value="" />
            <Picker.Item label="Bank" value="bank" />
            <Picker.Item label="Credit Card" value="credit_card" />
            <Picker.Item label="Cash" value="cash" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        {visibleAccountErrors.type && <Text style={styles.errorText}>{visibleAccountErrors.type}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Opening balance"
          value={balance}
          onChangeText={(value) => {
            setBalance(value);
            setSuccessMessage('');
            setTouchedFields(prev => ({ ...prev, balance: true }));
          }}
          keyboardType="decimal-pad"
          editable={!loading}
          placeholderTextColor="#999"
        />
        {visibleAccountErrors.balance && <Text style={styles.errorText}>{visibleAccountErrors.balance}</Text>}

        {editingId ? (
          <View style={styles.editActions}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, styles.buttonSpacing, (loading || !isAccountFormValid()) && styles.buttonDisabled]}
                onPress={handleEditAccount}
                disabled={loading || !isAccountFormValid()}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary, loading && styles.buttonDisabled]}
                onPress={() => resetForm()}
                disabled={loading}
              >
                <Text style={styles.buttonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonDanger, loading && styles.buttonDisabled]}
              onPress={handleDeleteAccount}
              disabled={loading}
            >
              <Text style={styles.buttonTextDanger}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary, (loading || !isAccountFormValid()) && styles.buttonDisabled]}
            onPress={handleCreateAccount}
            disabled={loading || !isAccountFormValid()}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* List Section */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Saved Accounts</Text>
        {accounts.length === 0 ? (
          <Text style={styles.emptyText}>No accounts yet. Create one above!</Text>
        ) : (
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.id}
            renderItem={renderAccountItem}
            scrollEnabled={false}
          />
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
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  formSectionEditing: {
    borderLeftWidth: 3,
    borderLeftColor: '#7aa7ff',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7aa7ff',
  },
  editBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7aa7ff',
    textTransform: 'uppercase',
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
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    paddingHorizontal: 8,
    marginBottom: 12,
    minHeight: 44,
  },
  pickerWrapper: {
    marginBottom: 12,
  },
  automationRow: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  automationButton: {
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  automationButtonSpacing: {
    marginBottom: 8,
  },
  automationButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  buttonPrimary: {
    backgroundColor: '#0066cc',
    flex: 1,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c8c8c8',
    flex: 1,
  },
  buttonDanger: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: '#b3b3b3',
    opacity: 0.65,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDanger: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editActions: {
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  buttonSpacing: {
    marginRight: 8,
  },
  listSection: {
    marginTop: 18,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 14,
  },
  accountItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#c3d7ff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  accountItemActive: {
    backgroundColor: '#eff6ff',
    borderLeftColor: '#7aa7ff',
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  accountType: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  successText: {
    color: '#2d8a26',
    fontSize: 14,
    marginBottom: 12,
  },
  newAccountButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  newAccountButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
