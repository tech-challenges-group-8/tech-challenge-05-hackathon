import React, { useMemo } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, extractPixels } from '../../../utils';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';

interface AppTextInputProps extends TextInputProps {
  readonly label?: string;
  readonly error?: string;
  readonly helperText?: string;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    container: {
      marginBottom: rem(space[4]),
    },
    label: {
      fontSize: rem(fontSizes.sm),
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
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      backgroundColor: themeColors.background,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    inputError: {
      borderColor: themeColors.accent.DEFAULT,
    },
    errorText: {
      color: themeColors.accent.DEFAULT,
      fontSize: rem(fontSizes.xs),
      marginTop: rem(space[1]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    helperText: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.muted.foreground,
      marginTop: rem(space[1]),
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
  });

export function AppTextInput({
  label,
  error,
  helperText,
  placeholderTextColor: _,
  ...props
}: AppTextInputProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [theme.colors, preferences]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={theme.colors.muted.foreground}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!error && helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}
