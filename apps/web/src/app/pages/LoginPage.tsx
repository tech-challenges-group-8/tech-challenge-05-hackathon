import { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth';
import { logger, validateLoginForm } from '../../utils';
import { AppButton, AppTextInput, AuthFormLayout } from '../components/ui';

interface LoginPageProps {
  readonly onSwitchToRegister?: () => void;
}

export function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { t } = useTranslation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const webFormProps: Record<string, unknown> = Platform.OS === 'web' ? { role: 'form' } : {};
  const webAlertProps: Record<string, unknown> =
    Platform.OS === 'web' ? { role: 'alert', 'aria-live': 'assertive' } : {};

  const handleSubmit = async () => {
    const { valid, errors } = validateLoginForm(email, password);

    if (!valid) {
      const translated: Record<string, string> = {};
      for (const [field, key] of Object.entries(errors)) {
        translated[field] = t(key);
      }
      setFieldErrors(translated);
      return;
    }

    setFieldErrors({});

    try {
      setIsSubmitting(true);
      setServerError(null);
      await login({ email, password });
    } catch (authError) {
      logger.error('Login failed:', authError);
      setServerError(t('login.errors.invalidCredentials'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormLayout
      title={t('login.title')}
      subtitle={t('login.subtitle')}
      helperText={t('login.helper')}
      switchLabel={t('login.switchToRegister')}
      onSwitchClick={onSwitchToRegister}
      switchAccessibilityLabel={t('accessibility.auth.switchToRegister')}
    >
      <View
        {...webFormProps}
        accessibilityLabel={t('accessibility.auth.loginForm')}
      >
        {serverError && (
          <View
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
            {...webAlertProps}
            style={{ marginBottom: 12 }}
          >
            <Text>{serverError}</Text>
          </View>
        )}

        <AppTextInput
          label={t('login.emailLabel')}
          placeholder={t('login.emailPlaceholder')}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
          }}
          textContentType={Platform.OS === 'ios' ? 'username' : 'none'}
          error={fieldErrors.email}
          returnKeyType="next"
        />

        <AppTextInput
          label={t('login.passwordLabel')}
          placeholder={t('login.passwordPlaceholder')}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
          }}
          textContentType={Platform.OS === 'ios' ? 'password' : 'none'}
          error={fieldErrors.password}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <AppButton
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          accessibilityLabel={t('accessibility.auth.submitLogin')}
        >
          {t('login.submit')}
        </AppButton>
      </View>
    </AuthFormLayout>
  );
}
