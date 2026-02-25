import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { authService } from '../../services';

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
    scrollContent: {
      width: '100%',
      maxWidth: 480,
      paddingVertical: rem(space[4]),
    },
    card: {
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
    linkButton: {
      marginTop: rem(space[4]),
      paddingVertical: rem(space[3]),
    },
    linkText: {
      color: themeColors.primary.DEFAULT,
      fontWeight: fontWeights.semiBold as any,
      fontSize: rem(fontSizes.sm),
      textAlign: 'center',
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

interface RegisterPageProps {
  readonly onSwitchToLogin?: () => void;
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!name || !email || !password || !confirmPassword) {
      setError(t('register.errors.missingFields'));
      return false;
    }

    if (password !== confirmPassword) {
      setError(t('register.errors.passwordMismatch'));
      return false;
    }

    if (password.length < 6) {
      setError(t('register.errors.passwordTooShort'));
      return false;
    }

    if (!email.includes('@')) {
      setError(t('register.errors.invalidEmail'));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await authService.register(name, email, password);
      // Registration successful - redirect to login page
      onSwitchToLogin?.();
    } catch (authError) {
      console.error('Registration failed:', authError);
      const message = authError instanceof Error ? authError.message : '';
      if (message.includes('already exists')) {
        setError(t('register.errors.emailExists'));
      } else {
        setError(t('register.errors.failed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('register.title')}</Text>
          <Text style={styles.subtitle}>{t('register.subtitle')}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('register.nameLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('register.namePlaceholder')}
              placeholderTextColor={theme.colors.muted.foreground}
              value={name}
              onChangeText={setName}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('register.emailLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('register.emailPlaceholder')}
              placeholderTextColor={theme.colors.muted.foreground}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!isSubmitting}
              textContentType={Platform.OS === 'ios' ? 'username' : 'none'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('register.passwordLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('register.passwordPlaceholder')}
              placeholderTextColor={theme.colors.muted.foreground}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isSubmitting}
              textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('register.confirmPasswordLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('register.confirmPasswordPlaceholder')}
              placeholderTextColor={theme.colors.muted.foreground}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isSubmitting}
              textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityLabel={t('register.submit')}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.primary.foreground} />
            ) : (
              <Text style={styles.buttonText}>{t('register.submit')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={onSwitchToLogin}
            disabled={isSubmitting}
          >
            <Text style={styles.linkText}>{t('register.switchToLogin')}</Text>
          </TouchableOpacity>

          <Text style={styles.helperText}>{t('register.helper')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
