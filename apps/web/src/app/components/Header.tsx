import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useAuth } from '../../auth';
import { UserProfilePage } from '../pages/UserProfilePage';
import { useCognitivePreferences } from '../../cognitive';

// Helper to convert rem to pixels (assuming 16px base)
const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    header: {
      height: rem(space[16]),
      backgroundColor: themeColors.card.DEFAULT,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: rem(space[6]),
    },
    headerTitle: {
      fontSize: rem(fontSizes.xl) * preferences.fontScale,
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      width: rem(space[10]),
      height: rem(space[10]),
      marginLeft: rem(space[3]),
      borderRadius: extractPixels(radii.full),
      backgroundColor: themeColors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerButtonIcon: {
      color: themeColors.primary.foreground,
    },
    headerButtonSecondary: {
      backgroundColor: themeColors.secondary.DEFAULT,
    },
    headerButtonSecondaryIcon: {
      color: themeColors.secondary.foreground,
    },
    dropdown: {
      position: 'absolute',
      top: rem(space[16]) + rem(space[2]),
      right: rem(space[6]),
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.md),
      minWidth: rem(space[40]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      zIndex: 1000,
    },
    dropdownItem: {
      paddingHorizontal: rem(space[4]),
      paddingVertical: rem(space[3]),
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[3]),
    },
    dropdownItemLast: {
      borderBottomWidth: 0,
    },
    dropdownItemText: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.foreground,
      fontWeight: fontWeights.semiBold as any,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    dropdownItemLogout: {
      color: themeColors.primary.DEFAULT,
    },
    overlay: {
      flex: 1,
    },
  });

interface HeaderProps {
  title: string;
  onNewTask?: () => void;
  onProfile?: () => void;
}

export function Header({ title, onNewTask, onProfile }: HeaderProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { logout, currentUser } = useAuth();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
  };

  const handleOpenProfile = () => {
    setShowProfileMenu(false);
    setShowProfilePage(true);
  };

  const handleProfilePress = () => {
    setShowProfileMenu(!showProfileMenu);
    onProfile?.();
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onNewTask}
          accessibilityLabel={t('header.newTask')}
        >
          <Ionicons
            name="add"
            size={rem(fontSizes.lg)}
            style={styles.headerButtonIcon}
          />
        </TouchableOpacity>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity
            style={[styles.headerButton, styles.headerButtonSecondary]}
            onPress={handleProfilePress}
            accessibilityLabel={t('header.profile')}
          >
            <Ionicons
              name="person-circle"
              size={rem(fontSizes.lg)}
              style={styles.headerButtonSecondaryIcon}
            />
          </TouchableOpacity>

          {showProfileMenu && Platform.OS === 'web' && (
            <>
              <Modal transparent visible={showProfileMenu} onRequestClose={() => setShowProfileMenu(false)}>
                <TouchableOpacity style={styles.overlay} onPress={() => setShowProfileMenu(false)} />
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={handleOpenProfile}
                  >
                    <Ionicons name="person" size={rem(fontSizes.md)} color={theme.colors.foreground} />
                    <Text style={styles.dropdownItemText}>{currentUser?.name || t('header.profile')}</Text>
                  </TouchableOpacity>
                  {!preferences.simpleInterface && (
                    <View style={styles.dropdownItem}>
                      <Ionicons name="mail" size={rem(fontSizes.md)} color={theme.colors.muted.foreground} />
                      <Text style={{ ...styles.dropdownItemText, color: theme.colors.muted.foreground }}>
                        {currentUser?.email}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={[styles.dropdownItem, styles.dropdownItemLast]}
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out" size={rem(fontSizes.md)} color={theme.colors.primary.DEFAULT} />
                    <Text style={[styles.dropdownItemText, styles.dropdownItemLogout]}>
                      {t('header.logout')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </>
          )}

          {showProfilePage && (
            <Modal
              visible={showProfilePage}
              animationType={preferences.animationsEnabled ? 'fade' : 'none'}
              onRequestClose={() => setShowProfilePage(false)}
            >
              <UserProfilePage onClose={() => setShowProfilePage(false)} />
            </Modal>
          )}
        </View>
      </View>
    </View>
  );
}
