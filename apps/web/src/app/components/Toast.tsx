import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme } from '../../theme';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  readonly visible: boolean;
  readonly message: string;
  readonly variant?: ToastVariant;
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
      fontWeight: fontWeights.semiBold as any,
    },
    success: {
      backgroundColor: themeColors.primary.DEFAULT,
    },
    error: {
      backgroundColor: themeColors.accent.DEFAULT,
    },
    info: {
      backgroundColor: themeColors.secondary.DEFAULT,
    },
    successText: {
      color: themeColors.primary.foreground,
    },
    errorText: {
      color: themeColors.accent.foreground,
    },
    infoText: {
      color: themeColors.secondary.foreground,
    },
  });

export function Toast({ visible, message, variant = 'success' }: ToastProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, styles[variant]]}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{message}</Text>
    </View>
  );
}
