import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme';
import { useAuth } from '../../auth';
import { useCognitiveSettings } from '../../cognitive';
import { LoginPage, RegisterPage } from '../pages';

interface AuthGateProps {
  children: React.ReactNode;
}

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    mainContent: {
      flex: 1,
      flexDirection: 'column',
    },
    content: {
      flex: 1,
      padding: 16,
    },
  });

/**
 * AuthGate component handles authentication flow.
 * Shows login/register pages if user is not authenticated,
 * shows loading state while authenticating, otherwise renders children.
 */
export function AuthGate({ children }: AuthGateProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { currentUser, isLoading } = useAuth();
  const { isLoading: isLoadingCognitive } = useCognitiveSettings();
  const [isRegistering, setIsRegistering] = useState(false);

  const styles = createStyles(theme.colors);

  // Show loading state
  if (isLoading || (currentUser && isLoadingCognitive)) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.mainContent}>
          <ScrollView style={styles.content}>
            <Text>{t('login.loading')}</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // Show auth pages if not logged in
  if (!currentUser) {
    return isRegistering ? (
      <RegisterPage onSwitchToLogin={() => setIsRegistering(false)} />
    ) : (
      <LoginPage onSwitchToRegister={() => setIsRegistering(true)} />
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}
