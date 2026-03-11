import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './page';
import '../i18n';
import { ThemeProvider } from '../theme';
import { AuthProvider } from '../auth';
import { CognitiveSettingsProvider } from '../cognitive';
import { FocusTimerProvider } from './context/FocusTimerContext';
import { HiddenYouTubePlayer } from './components/pomodoro/HiddenYouTubePlayer';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme="light">
        <AuthProvider>
          <CognitiveSettingsProvider>
            <FocusTimerProvider>
              <Home />
              <HiddenYouTubePlayer />
            </FocusTimerProvider>
          </CognitiveSettingsProvider>
        </AuthProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
