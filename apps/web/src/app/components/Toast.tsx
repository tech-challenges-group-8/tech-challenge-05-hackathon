import { useMemo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';
import { rem, extractPixels, fontWeight } from '../../utils';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  readonly visible: boolean;
  readonly message: string;
  readonly variant?: ToastVariant;
  readonly onDismiss?: () => void;
}

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: rem(space[4]),
      alignSelf: 'center',
      borderRadius: extractPixels(radii.md),
      paddingVertical: rem(space[3]),
      paddingHorizontal: rem(space[4]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 6,
      zIndex: 20,
    },
    text: {
      fontSize: rem(fontSizes.sm),
      textAlign: 'center',
      fontWeight: fontWeight(fontWeights.semiBold),
    },
    success: {
      backgroundColor: themeColors.primary.DEFAULT,
    },
    error: {
      backgroundColor: themeColors.destructive.DEFAULT,
    },
    info: {
      backgroundColor: themeColors.secondary.DEFAULT,
    },
    successText: {
      color: themeColors.primary.foreground,
    },
    errorText: {
      color: themeColors.destructive.foreground,
    },
    infoText: {
      color: themeColors.secondary.foreground,
    },
  });

export function Toast({ visible, message, variant = 'success', onDismiss }: ToastProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);
  const webAlertProps: Record<string, unknown> = Platform.OS === 'web'
    ? { role: 'alert', 'aria-live': variant === 'error' ? 'assertive' : 'polite' }
    : {};

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[styles.container, styles[variant]]}
      accessibilityRole="alert"
      accessibilityLiveRegion={variant === 'error' ? 'assertive' : 'polite'}
      {...webAlertProps}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={t('accessibility.components.dismissNotification')}
          style={{ marginTop: rem(space[2]) }}
        >
          <Text style={[styles.text, styles[`${variant}Text`]]}>{t('common.close')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
