import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, space } from '@mindease/ui-kit';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem } from '../../../utils';
import { AppButton, AppTextInput, Card } from '../ui';

interface ProfileSectionProps {
  readonly email?: string;
  readonly name: string;
  readonly onNameChange: (value: string) => void;
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
    card: {
      marginBottom: rem(space[6]),
    },
    sectionTitle: {
      fontSize: rem(fontSizes.lg) * preferences.fontScale,
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[4]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    infoLabel: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      marginBottom: rem(space[1]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    infoValue: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      marginBottom: rem(space[4]),
      fontWeight: fontWeights.semiBold as any,
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

export function ProfileSection({
  email,
  name,
  onNameChange,
  onSubmit,
  isSubmitting,
  error,
  success,
}: ProfileSectionProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <Card style={styles.card}>
      <Text style={styles.sectionTitle}>{t('userProfile.profileSection')}</Text>
      <Text style={styles.infoLabel}>{t('userProfile.emailLabel')}</Text>
      <Text style={styles.infoValue}>{email}</Text>

      <AppTextInput
        label={t('userProfile.nameLabel')}
        placeholder={t('userProfile.namePlaceholder')}
        value={name}
        onChangeText={onNameChange}
        editable={!isSubmitting}
        error={error ?? undefined}
      />

      {success ? (
        <Text style={[styles.feedbackText, styles.successText]}>{t('userProfile.updateSuccess')}</Text>
      ) : null}

      <AppButton onPress={onSubmit} loading={isSubmitting}>
        {t('userProfile.updateName')}
      </AppButton>
    </Card>
  );
}
