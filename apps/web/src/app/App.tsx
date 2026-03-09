import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './page';
import '../i18n';
import { ThemeProvider } from '../theme';
import { AuthProvider } from '../auth';
import { FocusTimerProvider } from './context/FocusTimerContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme="light">
        <AuthProvider>
          <FocusTimerProvider>
            <Home />
          </FocusTimerProvider>
        </AuthProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
