import { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services';
import { logger, validateRegisterForm } from '../../utils';
import { Toast } from '../components/Toast';
import { AppButton, AppTextInput, AuthFormLayout } from '../components/ui';

const styles = {
  container: { flex: 1 } as const,
};

interface RegisterPageProps {
  readonly onSwitchToLogin?: () => void;
}

export function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const webFormProps: Record<string, unknown> = Platform.OS === 'web' ? { role: 'form' } : {};
  const webSuccessLiveProps: Record<string, unknown> =
    Platform.OS === 'web' ? { 'aria-live': 'polite' } : {};
  const webAlertProps: Record<string, unknown> =
    Platform.OS === 'web' ? { role: 'alert', 'aria-live': 'assertive' } : {};

  const handleSubmit = async () => {
    const { valid, errors } = validateRegisterForm(name, email, password, confirmPassword);

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
      setSuccess(false);
      await authService.register(name, email, password);
      setSuccess(true);
      setTimeout(() => {
        onSwitchToLogin?.();
      }, 2000);
    } catch (authError) {
      logger.error('Registration failed:', authError);
      const message = authError instanceof Error ? authError.message : '';
      if (message.includes('already exists')) {
        setServerError(t('register.errors.emailExists'));
      } else {
        setServerError(t('register.errors.failed'));
      }
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Toast visible={success} message={t('register.success')} variant="success" />
      <AuthFormLayout
        title={t('register.title')}
        subtitle={t('register.subtitle')}
        helperText={t('register.helper')}
        switchLabel={t('register.switchToLogin')}
        onSwitchClick={onSwitchToLogin}
        switchAccessibilityLabel={t('accessibility.auth.switchToLogin')}
      >
          <View
            {...webFormProps}
            accessibilityLabel={t('accessibility.auth.registerForm')}
          >
            {success && (
              <View
                accessibilityLiveRegion="polite"
                {...webSuccessLiveProps}
                style={{ marginBottom: 12 }}
              >
                <Text>{t('register.success')}</Text>
              </View>
            )}

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
              label={t('register.nameLabel')}
              placeholder={t('register.namePlaceholder')}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: '' });
              }}
              editable={!isSubmitting}
              error={fieldErrors.name}
              returnKeyType="next"
            />

            <AppTextInput
              label={t('register.emailLabel')}
              placeholder={t('register.emailPlaceholder')}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
              }}
              editable={!isSubmitting}
              textContentType={Platform.OS === 'ios' ? 'username' : 'none'}
              error={fieldErrors.email}
              returnKeyType="next"
            />

            <AppTextInput
              label={t('register.passwordLabel')}
              placeholder={t('register.passwordPlaceholder')}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: '' });
              }}
              editable={!isSubmitting}
              textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
              error={fieldErrors.password}
              returnKeyType="next"
            />

            <AppTextInput
              label={t('register.confirmPasswordLabel')}
              placeholder={t('register.confirmPasswordPlaceholder')}
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: '' });
              }}
              editable={!isSubmitting}
              textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
              error={fieldErrors.confirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            <AppButton
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              accessibilityLabel={t('accessibility.auth.submitRegister')}
            >
              {t('register.submit')}
            </AppButton>
          </View>
      </AuthFormLayout>
    </View>
  );
}
