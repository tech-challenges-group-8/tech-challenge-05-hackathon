import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '../../services';

interface UseUpdateProfileParams {
  readonly initialName: string;
}

export function useUpdateProfile({ initialName }: UseUpdateProfileParams) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const submit = useCallback(async () => {
    if (!name.trim()) {
      setError(t('userProfile.errors.nameRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      await userService.updateProfile({ name: name.trim() });
      setSuccess(true);
      globalThis.setTimeout(() => setSuccess(false), 3000);
    } catch (requestError) {
      console.error('Failed to update name:', requestError);
      setError(t('userProfile.errors.updateFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [name, t]);

  return {
    name,
    setName,
    isSubmitting,
    error,
    success,
    submit,
  };
}
