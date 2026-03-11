import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { useAuth } from '../../auth';
import { UserProfilePage } from '../pages/UserProfilePage';
import { useCognitivePreferences } from '../../cognitive';
import { rem, extractPixels, fontWeight } from '../../utils';

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
      fontWeight: fontWeight(fontWeights.semiBold),
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileTriggerContainer: {
      position: 'relative',
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
      fontWeight: fontWeight(fontWeights.semiBold),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    dropdownItemMutedText: {
      color: themeColors.muted.foreground,
    },
    dropdownItemLogout: {
      color: themeColors.primary.DEFAULT,
    },
    overlay: {
      flex: 1,
    },
  });

interface HeaderProps {
  readonly title: string;
  readonly onNewTask?: () => void;
  readonly onProfile?: () => void;
}

export function Header({ title }: HeaderProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { logout, currentUser } = useAuth();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const profileButtonRef = useRef<any>(null);
  const firstMenuItemRef = useRef<any>(null);
  const lastMenuItemRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !showProfileMenu) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowProfileMenu(false);
        profileButtonRef.current?.focus?.();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const first = firstMenuItemRef.current as unknown as HTMLElement | null;
      const last = lastMenuItemRef.current as unknown as HTMLElement | null;
      const active = document.activeElement;

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    setTimeout(() => firstMenuItemRef.current?.focus?.(), 0);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showProfileMenu]);

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
  };

  return (
    <View style={styles.header} accessibilityRole="summary" accessibilityLabel={t('accessibility.header.pageHeader')}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerActions}>
        <View style={styles.profileTriggerContainer}>
          <TouchableOpacity
            ref={profileButtonRef}
            style={[styles.headerButton, styles.headerButtonSecondary]}
            onPress={handleProfilePress}
            accessibilityRole="button"
            accessibilityState={{ expanded: showProfileMenu }}
            accessibilityLabel={t('header.profile')}
            accessibilityHint={t('accessibility.header.openUserMenu')}
            {...(Platform.OS === 'web'
              ? ({
                  'aria-haspopup': 'menu',
                } as never)
              : {})}
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
                <TouchableOpacity
                  style={styles.overlay}
                  onPress={() => setShowProfileMenu(false)}
                  accessibilityRole="button"
                  accessibilityLabel={t('accessibility.header.closeMenu')}
                />
                <View
                  style={styles.dropdown}
                  accessibilityRole="summary"
                  accessibilityLabel={t('accessibility.header.userMenu')}
                >
                  <TouchableOpacity
                    ref={firstMenuItemRef}
                    style={styles.dropdownItem}
                    onPress={handleOpenProfile}
                    accessibilityRole="button"
                    accessibilityLabel={t('accessibility.header.openProfile')}
                  >
                    <Ionicons name="person" size={rem(fontSizes.md)} color={theme.colors.foreground} />
                    <Text style={styles.dropdownItemText}>{currentUser?.name || t('header.profile')}</Text>
                  </TouchableOpacity>
                  {!preferences.simpleInterface && (
                    <View style={styles.dropdownItem}>
                      <Ionicons name="mail" size={rem(fontSizes.md)} color={theme.colors.muted.foreground} />
                      <Text style={[styles.dropdownItemText, styles.dropdownItemMutedText]}>
                        {currentUser?.email}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    ref={lastMenuItemRef}
                    style={[styles.dropdownItem, styles.dropdownItemLast]}
                    onPress={handleLogout}
                    accessibilityRole="button"
                    accessibilityLabel={t('header.logout')}
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
