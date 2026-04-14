import React, { useState, useEffect, useCallback } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { createAccount, getAllAccounts, updateAccount, deleteAccount } from '../database/accountsService';
import { Account } from '../database/types';

export default function AccountsScreen() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<'bank' | 'credit_card' | 'cash' | 'other'>('bank');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      const data = await getAllAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      Alert.alert('Error', 'Failed to load accounts');
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const resetForm = () => {
    setName('');
    setBalance('');
    setType('bank');
    setEditingId(null);
  };

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Account name is required');
      return;
    }

    if (balance.trim() === '' || isNaN(parseFloat(balance))) {
      Alert.alert('Error', 'Opening balance must be a valid number');
      return;
    }

    setLoading(true);
    try {
      await createAccount(name, type, parseFloat(balance));
      resetForm();
      await loadAccounts();
      Alert.alert('Success', 'Account created successfully');
    } catch (error) {
      console.error('Failed to create account:', error);
      Alert.alert('Error', 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAccount = async () => {
    if (!editingId) return;

    if (!name.trim()) {
      Alert.alert('Error', 'Account name is required');
      return;
    }

    if (balance.trim() === '' || isNaN(parseFloat(balance))) {
      Alert.alert('Error', 'Opening balance must be a valid number');
      return;
    }

    setLoading(true);
    try {
      await updateAccount(editingId, name, type, parseFloat(balance));
      resetForm();
      await loadAccounts();
      Alert.alert('Success', 'Account updated successfully');
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
      <Text style={styles.accountBalance}>${item.opening_balance.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Accounts</Text>

      {/* Form Section */}
      <View style={[styles.formSection, editingId && styles.formSectionEditing]}>
        <View style={styles.formHeader}>
          <Text style={styles.sectionTitle}>
            {editingId ? 'Edit Account' : 'Create New Account'}
          </Text>
          {editingId && <View style={styles.editBadge}><Text style={styles.editBadgeText}>EDITING</Text></View>}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Account name"
          value={name}
          onChangeText={setName}
          editable={!loading}
          placeholderTextColor="#999"
        />

        <Picker
          style={styles.picker}
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue as any)}
          enabled={!loading}
        >
          <Picker.Item label="Bank" value="bank" />
          <Picker.Item label="Credit Card" value="credit_card" />
          <Picker.Item label="Cash" value="cash" />
          <Picker.Item label="Other" value="other" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Opening balance"
          value={balance}
          onChangeText={setBalance}
          keyboardType="decimal-pad"
          editable={!loading}
          placeholderTextColor="#999"
        />

        {editingId ? (
          <View style={styles.editActions}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, styles.buttonSpacing, loading && styles.buttonDisabled]}
                onPress={handleEditAccount}
                disabled={loading}
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
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateAccount}
            disabled={loading}
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
});