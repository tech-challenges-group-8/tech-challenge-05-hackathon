import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './page';
import '../i18n';
import { ThemeProvider } from '../theme';
import { AuthProvider } from '../auth';
import { CognitiveSettingsProvider } from '../cognitive';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme="light">
        <AuthProvider>
          <CognitiveSettingsProvider>
            <Home />
          </CognitiveSettingsProvider>
        </AuthProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
