import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../../services';
import { logger } from '../../utils';

export function useChangePassword() {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('userProfile.errors.passwordFieldsRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('userProfile.errors.passwordMismatch'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('userProfile.errors.passwordTooShort'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      await userService.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      globalThis.setTimeout(() => setSuccess(false), 3000);
    } catch (requestError) {
      logger.error('Failed to change password:', requestError);
      const message = requestError instanceof Error ? requestError.message : '';

      if (message.includes('401') || message.includes('Unauthorized')) {
        setError(t('userProfile.errors.invalidCurrentPassword'));
        return;
      }

      setError(t('userProfile.errors.changeFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [confirmPassword, currentPassword, newPassword, t]);

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isSubmitting,
    error,
    success,
    submit,
  };
}
