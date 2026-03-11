import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
}: ModalSheetProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType={type === 'centered' ? 'fade' : 'slide'}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={[styles.overlay, type === 'centered' && styles.overlayCenter]}
        >
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.container,
                type === 'centered' && styles.containerCentered,
              ]}
            >
              <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.title}>{title}</Text>
                  {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
