import { useMemo } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, fontWeight } from '../../../utils';
import { AppButton, AppTextInput, Card } from '../ui';

interface PasswordSectionProps {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
  readonly onCurrentPasswordChange: (value: string) => void;
  readonly onNewPasswordChange: (value: string) => void;
  readonly onConfirmPasswordChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly isSubmitting: boolean;
  readonly error: string | null;
  readonly success: boolean;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: rem(fontSizes.lg) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.bold),
      color: themeColors.foreground,
      marginBottom: rem(space[4]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    feedbackText: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      marginBottom: rem(space[2]),
      textAlign: 'center',
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    errorText: {
      color: themeColors.destructive.DEFAULT,
    },
    successText: {
      color: themeColors.primary.DEFAULT,
    },
  });

export function PasswordSection({
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isSubmitting,
  error,
  success,
}: PasswordSectionProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);
  const webPoliteLiveProps: Record<string, unknown> = Platform.OS === 'web' ? { 'aria-live': 'polite' } : {};

  const requiredFieldsError = error === t('userProfile.errors.passwordFieldsRequired') ? error : undefined;
  const currentPasswordError =
    error === t('userProfile.errors.invalidCurrentPassword') ? error : requiredFieldsError;
  const newPasswordError = error === t('userProfile.errors.passwordTooShort') ? error : requiredFieldsError;
  const confirmPasswordError = error === t('userProfile.errors.passwordMismatch') ? error : requiredFieldsError;
  const formError = error === t('userProfile.errors.changeFailed') ? error : undefined;

  return (
    <Card>
      <Text style={styles.sectionTitle}>{t('userProfile.passwordSection')}</Text>

      <AppTextInput
        label={t('userProfile.currentPasswordLabel')}
        placeholder={t('userProfile.currentPasswordPlaceholder')}
        secureTextEntry
        value={currentPassword}
        onChangeText={onCurrentPasswordChange}
        editable={!isSubmitting}
        textContentType={Platform.OS === 'ios' ? 'password' : 'none'}
        error={currentPasswordError}
      />

      <AppTextInput
        label={t('userProfile.newPasswordLabel')}
        placeholder={t('userProfile.newPasswordPlaceholder')}
        secureTextEntry
        value={newPassword}
        onChangeText={onNewPasswordChange}
        editable={!isSubmitting}
        textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
        error={newPasswordError}
      />

      <AppTextInput
        label={t('userProfile.confirmPasswordLabel')}
        placeholder={t('userProfile.confirmPasswordPlaceholder')}
        secureTextEntry
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        editable={!isSubmitting}
        textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
        error={confirmPasswordError}
      />

      {formError ? (
        <Text style={[styles.feedbackText, styles.errorText]} accessibilityRole="alert">
          {formError}
        </Text>
      ) : null}

      {success ? (
        <Text
          style={[styles.feedbackText, styles.successText]}
          accessibilityLiveRegion="polite"
          {...webPoliteLiveProps}
        >
          {t('userProfile.changeSuccess')}
        </Text>
      ) : null}

      <AppButton onPress={onSubmit} loading={isSubmitting}>
        {t('userProfile.submitChangePassword')}
      </AppButton>
    </Card>
  );
}
