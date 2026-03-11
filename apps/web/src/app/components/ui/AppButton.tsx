import React, { useMemo } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../theme';
import { rem, extractPixels, fontWeight } from '../../../utils';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface AppButtonProps {
  readonly onPress: () => void;
  readonly children: React.ReactNode;
  readonly variant?: ButtonVariant;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly icon?: React.ReactNode;
  readonly style?: ViewStyle;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
) =>
  StyleSheet.create({
    baseButton: {
      height: rem(space[12]),
      borderRadius: extractPixels(radii.md),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: rem(space[2]),
      flexDirection: 'row',
      gap: rem(space[2]),
    },
    primaryButton: {
      backgroundColor: themeColors.primary.DEFAULT,
    },
    secondaryButton: {
      backgroundColor: themeColors.secondary.DEFAULT,
    },
    dangerButton: {
      backgroundColor: themeColors.destructive.DEFAULT,
    },
    ghostButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    disabledButton: {
      opacity: 0.5,
    },
    buttonText: {
      fontWeight: fontWeight(fontWeights.semiBold),
      fontSize: rem(fontSizes.sm),
    },
    primaryText: {
      color: themeColors.primary.foreground,
    },
    secondaryText: {
      color: themeColors.secondary.foreground,
    },
    dangerText: {
      color: themeColors.destructive.foreground,
    },
    ghostText: {
      color: themeColors.foreground,
    },
  });

export function AppButton({
  onPress,
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}: AppButtonProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const variantMap: Record<ButtonVariant, ViewStyle> = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    danger: styles.dangerButton,
    ghost: styles.ghostButton,
  };

  const textMap: Record<ButtonVariant, TextStyle> = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    danger: styles.dangerText,
    ghost: styles.ghostText,
  };

  return (
    <TouchableOpacity
      style={[styles.baseButton, variantMap[variant], disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'ghost' || variant === 'secondary'
              ? theme.colors.foreground
              : variant === 'danger'
                ? theme.colors.destructive.foreground
                : theme.colors.primary.foreground
          }
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.buttonText, textMap[variant]]}>{children}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
