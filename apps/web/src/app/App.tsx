import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './page';
import '../i18n';
import { ThemeProvider } from '../theme';
import { AuthProvider } from '../auth';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme="light">
        <AuthProvider>
          <Home />
        </AuthProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
