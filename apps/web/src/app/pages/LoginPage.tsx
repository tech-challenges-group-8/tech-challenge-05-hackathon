import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { useAuth } from '../../auth';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: rem(space[6]),
      backgroundColor: themeColors.background,
    },
    card: {
      width: '100%',
      maxWidth: 480,
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    },
    title: {
      fontSize: rem(fontSizes['3xl']),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
      textAlign: 'center',
    },
    subtitle: {
      fontSize: rem(fontSizes.md),
      color: themeColors.muted.foreground,
      marginBottom: rem(space[6]),
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: rem(space[4]),
    },
    label: {
      fontSize: rem(fontSizes.sm),
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: extractPixels(radii.md),
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[3]),
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      backgroundColor: themeColors.background,
    },
    button: {
      height: rem(space[12]),
      borderRadius: extractPixels(radii.md),
      backgroundColor: themeColors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: rem(space[2]),
      flexDirection: 'row',
      gap: rem(space[2]),
    },
    buttonText: {
      color: themeColors.primary.foreground,
      fontWeight: fontWeights.semiBold as any,
      fontSize: rem(fontSizes.sm),
    },
    errorText: {
      color: themeColors.primary.DEFAULT,
      fontSize: rem(fontSizes.xs),
      marginBottom: rem(space[3]),
      textAlign: 'center',
    },
    helperText: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.muted.foreground,
      textAlign: 'center',
      marginTop: rem(space[4]),
    },
  });

interface LoginPageProps {
  readonly onSwitchToRegister?: () => void;
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError(t('login.errors.missingFields'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await login({ email, password });
    } catch (authError) {
      console.error('Login failed:', authError);
      setError(t('login.errors.invalidCredentials'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('login.title')}</Text>
        <Text style={styles.subtitle}>{t('login.subtitle')}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('login.emailLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('login.emailPlaceholder')}
            placeholderTextColor={theme.colors.muted.foreground}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            textContentType={Platform.OS === 'ios' ? 'username' : 'none'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('login.passwordLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('login.passwordPlaceholder')}
            placeholderTextColor={theme.colors.muted.foreground}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            textContentType={Platform.OS === 'ios' ? 'password' : 'none'}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={isSubmitting}
          accessibilityLabel={t('login.submit')}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.colors.primary.foreground} />
          ) : (
            <Text style={styles.buttonText}>{t('login.submit')}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.helperText}>{t('login.helper')}</Text>

        <TouchableOpacity
          style={{ marginTop: rem(space[4]), paddingVertical: rem(space[3]) }}
          onPress={onSwitchToRegister}
          disabled={isSubmitting}
        >
          <Text style={{ color: theme.colors.primary.DEFAULT, fontWeight: fontWeights.semiBold as any, fontSize: rem(fontSizes.sm), textAlign: 'center' }}>
            {t('login.switchToRegister')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
