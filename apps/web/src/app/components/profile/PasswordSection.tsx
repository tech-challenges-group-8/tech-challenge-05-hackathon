import { useMemo } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem } from '../../../utils';
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
      fontWeight: fontWeights.bold as any,
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
      color: themeColors.accent.DEFAULT,
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
      />

      <AppTextInput
        label={t('userProfile.newPasswordLabel')}
        placeholder={t('userProfile.newPasswordPlaceholder')}
        secureTextEntry
        value={newPassword}
        onChangeText={onNewPasswordChange}
        editable={!isSubmitting}
        textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
      />

      <AppTextInput
        label={t('userProfile.confirmPasswordLabel')}
        placeholder={t('userProfile.confirmPasswordPlaceholder')}
        secureTextEntry
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        editable={!isSubmitting}
        textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
        error={error ?? undefined}
      />

      {success ? (
        <Text style={[styles.feedbackText, styles.successText]}>{t('userProfile.changeSuccess')}</Text>
      ) : null}

      <AppButton onPress={onSubmit} loading={isSubmitting}>
        {t('userProfile.submitChangePassword')}
      </AppButton>
    </Card>
  );
}
