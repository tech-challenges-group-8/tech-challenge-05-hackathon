import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, extractPixels, fontWeight } from '../../../utils';

interface ModalSheetProps {
  readonly isVisible: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly subtitle?: string;
  readonly children: React.ReactNode;
  readonly type?: 'bottom-sheet' | 'centered';
  readonly closeAccessibilityLabel?: string;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    overlayCenter: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: themeColors.card.DEFAULT,
      borderTopLeftRadius: extractPixels(radii.xl),
      borderTopRightRadius: extractPixels(radii.xl),
      paddingHorizontal: rem(space[6]),
      paddingVertical: rem(space[4]),
      paddingBottom: rem(space[8]),
      maxHeight: '90%',
    },
    containerCentered: {
      borderRadius: extractPixels(radii.lg),
      minWidth: '80%',
      maxHeight: '80%',
    },
    header: {
      marginBottom: rem(space[4]),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: rem(space[2]),
    },
    content: {
      gap: rem(space[2]),
    },
    headerTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: rem(fontSizes.xl) * preferences.fontScale,
      fontWeight: fontWeight('700'),
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      flex: 1,
    },
    subtitle: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      marginBottom: rem(space[2]),
    },
    closeButton: {
      padding: rem(space[2]),
      marginRight: -rem(space[2]),
    },
  });

export function ModalSheet({
  isVisible,
  onClose,
  title,
  subtitle,
  children,
  type = 'bottom-sheet',
  closeAccessibilityLabel,
}: ModalSheetProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);
  const modalContainerRef = useRef<any>(null);
  const closeButtonRef = useRef<any>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const webDialogProps: Record<string, unknown> = Platform.OS === 'web'
    ? { role: 'dialog', 'aria-modal': true }
    : {};

  useEffect(() => {
    if (Platform.OS !== 'web' || !isVisible) {
      return;
    }

    previousActiveRef.current = document.activeElement as HTMLElement;
    setTimeout(() => closeButtonRef.current?.focus?.(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const container = modalContainerRef.current as HTMLElement | null;
      if (!container) {
        return;
      }

      const elements = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement as HTMLElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveRef.current?.focus();
    };
  }, [isVisible, onClose]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType={type === 'centered' ? 'fade' : 'slide'}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, type === 'centered' && styles.overlayCenter]}>
        <TouchableOpacity
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={closeAccessibilityLabel ?? t('accessibility.components.closeModal')}
          style={StyleSheet.absoluteFill}
        />
        <View
          ref={modalContainerRef}
          style={[
            styles.container,
            type === 'centered' && styles.containerCentered,
          ]}
          accessibilityViewIsModal
          accessibilityRole="summary"
          accessibilityLabel={title}
          {...webDialogProps}
        >
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <TouchableOpacity
              ref={closeButtonRef}
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={closeAccessibilityLabel ?? t('common.close')}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.foreground}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}
