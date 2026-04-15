import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AccountsScreen from '../screens/AccountsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DevTestScreen from '../screens/DevTestScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Add Transaction') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Accounts') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Dev Tools') {
            iconName = focused ? 'hammer' : 'hammer-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarButtonTestID: 'tab-dashboard',
          tabBarAccessibilityLabel: 'tab-dashboard',
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarButtonTestID: 'tab-transactions',
          tabBarAccessibilityLabel: 'tab-transactions',
        }}
      />
      <Tab.Screen
        name="Add Transaction"
        component={AddTransactionScreen}
        options={{
          tabBarLabel: 'Add',
          tabBarButtonTestID: 'tab-add',
          tabBarAccessibilityLabel: 'tab-add',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size}
              color={focused ? '#007AFF' : color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          tabBarButtonTestID: 'tab-accounts',
          tabBarAccessibilityLabel: 'tab-accounts',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarButtonTestID: 'tab-settings',
          tabBarAccessibilityLabel: 'tab-settings',
        }}
      />
      {__DEV__ ? (
        <Tab.Screen
          name="Dev Tools"
          component={DevTestScreen}
          options={{
            tabBarButtonTestID: 'tab-dev-tools',
            tabBarAccessibilityLabel: 'tab-dev-tools',
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
}
