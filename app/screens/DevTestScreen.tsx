import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  applySmokeTransactionUpdate,
  deleteSmokeTransaction,
  ensureSmokeAccount,
  ensureSmokeTransaction,
  resetSmokeState,
} from '../testing/smokeTestService';

type ActionKey =
  | 'reset'
  | 'createAccount'
  | 'createTransaction'
  | 'updateTransaction'
  | 'deleteTransaction';

export default function DevTestScreen() {
  const [loadingAction, setLoadingAction] = useState<ActionKey | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const runAction = async (
    actionKey: ActionKey,
    action: () => Promise<string>
  ) => {
    setLoadingAction(actionKey);
    setMessage('');
    setError('');

    try {
      const result = await action();
      setMessage(result);
    } catch (actionError) {
      console.error('Dev smoke action failed:', actionError);
      setError(actionError instanceof Error ? actionError.message : 'Smoke action failed');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Dev Tools</Text>
      <Text style={styles.subtitle}>Smoke Test Harness</Text>
      {message ? <Text style={styles.successText}>{message}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.card}>
        <TouchableOpacity
          testID="dev-reset-smoke-state"
          accessibilityLabel="dev-reset-smoke-state"
          style={styles.button}
          onPress={() => runAction('reset', resetSmokeState)}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'reset' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset Smoke State</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          testID="dev-create-smoke-account"
          accessibilityLabel="dev-create-smoke-account"
          style={styles.button}
          onPress={() => runAction('createAccount', ensureSmokeAccount)}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'createAccount' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Smoke Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          testID="dev-create-smoke-transaction"
          accessibilityLabel="dev-create-smoke-transaction"
          style={styles.button}
          onPress={() => runAction('createTransaction', ensureSmokeTransaction)}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'createTransaction' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Smoke Transaction</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          testID="dev-apply-smoke-update"
          accessibilityLabel="dev-apply-smoke-update"
          style={styles.button}
          onPress={() => runAction('updateTransaction', applySmokeTransactionUpdate)}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'updateTransaction' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Apply Smoke Transaction Update</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          testID="dev-delete-smoke-transaction"
          accessibilityLabel="dev-delete-smoke-transaction"
          style={[styles.button, styles.deleteButton]}
          onPress={() => runAction('deleteTransaction', deleteSmokeTransaction)}
          disabled={loadingAction !== null}
        >
          {loadingAction === 'deleteTransaction' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Delete Smoke Transaction</Text>
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
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  successText: {
    color: '#2f855a',
    fontSize: 14,
    marginBottom: 12,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    marginBottom: 0,
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
