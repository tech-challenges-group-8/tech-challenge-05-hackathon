import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useAuth } from '../../auth';
import { useCognitivePreferences } from '../../cognitive';
import { rem, extractPixels } from '../../utils';
import { useChangePassword, useUpdateProfile } from '../hooks';
import { PasswordSection, ProfileSection } from '../components/profile';

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      height: rem(space[16]),
      backgroundColor: themeColors.card.DEFAULT,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: rem(space[6]),
      gap: rem(space[4]),
    },
    headerButton: {
      width: rem(space[10]),
      height: rem(space[10]),
      borderRadius: extractPixels(radii.full),
      backgroundColor: themeColors.secondary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: rem(fontSizes.xl) * preferences.fontScale,
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
      flex: 1,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    content: {
      flex: 1,
      padding: rem(space[6]),
    },
    scrollContent: {
      paddingVertical: rem(space[4]),
    },
  });

interface UserProfilePageProps {
  readonly onClose?: () => void;
}

export function UserProfilePage({ onClose }: UserProfilePageProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);
  const { currentUser } = useAuth();

  const {
    name,
    setName,
    isSubmitting: isSubmittingName,
    error: nameError,
    success: nameSuccess,
    submit: handleUpdateName,
  } = useUpdateProfile({ initialName: currentUser?.name ?? '' });

  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isSubmitting: isSubmittingPassword,
    error: passwordError,
    success: passwordSuccess,
    submit: handleChangePassword,
  } = useChangePassword();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onClose}
          accessibilityLabel={t('userProfile.close')}
        >
          <Ionicons name="arrow-back" size={rem(fontSizes.lg)} color={theme.colors.secondary.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('userProfile.title')}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <ProfileSection
          email={currentUser?.email}
          name={name}
          onNameChange={setName}
          onSubmit={handleUpdateName}
          isSubmitting={isSubmittingName}
          error={nameError}
          success={nameSuccess}
        />

        <PasswordSection
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          onCurrentPasswordChange={setCurrentPassword}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleChangePassword}
          isSubmitting={isSubmittingPassword}
          error={passwordError}
          success={passwordSuccess}
        />
      </ScrollView>
    </View>
  );
}
