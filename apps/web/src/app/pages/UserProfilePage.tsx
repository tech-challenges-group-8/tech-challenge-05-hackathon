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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useAuth } from '../../auth';
import { userService } from '../../services';
import { useCognitivePreferences } from '../../cognitive';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

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
    card: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      marginBottom: rem(space[6]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: preferences.simpleInterface ? 0 : 0.1,
      shadowRadius: preferences.simpleInterface ? 0 : 8,
      elevation: preferences.simpleInterface ? 0 : 3,
    },
    sectionTitle: {
      fontSize: rem(fontSizes.lg) * preferences.fontScale,
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[4]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    inputGroup: {
      marginBottom: rem(space[4]),
    },
    label: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    input: {
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: extractPixels(radii.md),
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[3]),
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      backgroundColor: themeColors.background,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
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
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    successText: {
      color: '#4D9973',
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      marginBottom: rem(space[3]),
      textAlign: 'center',
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    errorText: {
      color: themeColors.primary.DEFAULT,
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      marginBottom: rem(space[3]),
      textAlign: 'center',
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    divider: {
      height: 1,
      backgroundColor: themeColors.border,
      marginVertical: rem(space[4]),
    },
    infoText: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      marginBottom: rem(space[2]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
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

  const [name, setName] = useState(currentUser?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmittingName, setIsSubmittingName] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleUpdateName = async () => {
    if (!name.trim()) {
      setNameError(t('userProfile.errors.nameRequired'));
      return;
    }

    try {
      setIsSubmittingName(true);
      setNameError(null);
      setNameSuccess(false);
      await userService.updateProfile({ name });
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update name:', error);
      setNameError(t('userProfile.errors.updateFailed'));
    } finally {
      setIsSubmittingName(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('userProfile.errors.passwordFieldsRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('userProfile.errors.passwordMismatch'));
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t('userProfile.errors.passwordTooShort'));
      return;
    }

    try {
      setIsSubmittingPassword(true);
      setPasswordError(null);
      setPasswordSuccess(false);
      await userService.changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
      const message = error instanceof Error ? error.message : '';
      if (message.includes('401') || message.includes('Unauthorized')) {
        setPasswordError(t('userProfile.errors.invalidCurrentPassword'));
      } else {
        setPasswordError(t('userProfile.errors.changeFailed'));
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  };

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
        {/* Profile Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('userProfile.profileSection')}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.infoText}>{t('userProfile.emailLabel')}</Text>
            <Text style={styles.label}>{currentUser?.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('userProfile.nameLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('userProfile.namePlaceholder')}
              placeholderTextColor={theme.colors.muted.foreground}
              value={name}
              onChangeText={setName}
              editable={!isSubmittingName}
            />
          </View>

          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          {nameSuccess ? <Text style={styles.successText}>{t('userProfile.updateSuccess')}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateName}
            disabled={isSubmittingName}
          >
            {isSubmittingName ? (
              <ActivityIndicator color={theme.colors.primary.foreground} />
            ) : (
              <Text style={styles.buttonText}>{t('userProfile.updateName')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Password Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('userProfile.passwordSection')}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('userProfile.currentPasswordLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('userProfile.currentPasswordPlaceholder')}
              placeholderTextColor={theme.colors.muted.foreground}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              editable={!isSubmittingPassword}
              textContentType={Platform.OS === 'ios' ? 'password' : 'none'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('userProfile.newPasswordLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('userProfile.newPasswordPlaceholder')}
              placeholderTextColor={theme.colors.muted.foreground}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!isSubmittingPassword}
              textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('userProfile.confirmPasswordLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('userProfile.confirmPasswordPlaceholder')}
              placeholderTextColor={theme.colors.muted.foreground}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isSubmittingPassword}
              textContentType={Platform.OS === 'ios' ? 'newPassword' : 'none'}
            />
          </View>

          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          {passwordSuccess ? <Text style={styles.successText}>{t('userProfile.changeSuccess')}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
            disabled={isSubmittingPassword}
          >
            {isSubmittingPassword ? (
              <ActivityIndicator color={theme.colors.primary.foreground} />
            ) : (
              <Text style={styles.buttonText}>{t('userProfile.changePassword')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
