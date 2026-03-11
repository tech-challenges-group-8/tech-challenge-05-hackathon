import { useState } from 'react';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth';
import { validateLoginForm } from '../../utils';
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
      console.error('Login failed:', authError);
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
    >
      {serverError && (
        <AppTextInput disabled error={serverError} />
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
      />

      <AppButton
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {t('login.submit')}
      </AppButton>
    </AuthFormLayout>
  );
}
