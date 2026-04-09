import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import { databaseService } from './database';

export default function App() {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await databaseService.initialize();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomTabNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
