import React, { useId, useMemo } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps, Platform } from 'react-native';
import { useTheme } from '../../../theme';
import { useCognitivePreferences } from '../../../cognitive';
import { rem, extractPixels, fontWeight } from '../../../utils';
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
      fontWeight: fontWeight(fontWeights.semiBold),
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
      borderColor: themeColors.destructive.DEFAULT,
    },
    errorText: {
      color: themeColors.destructive.DEFAULT,
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
  const reactId = useId();

  const inputNativeId = props.nativeID ?? `app-input-${reactId}`;
  const labelNativeId = label ? `${inputNativeId}-label` : undefined;
  const helperNativeId = helperText && !error ? `${inputNativeId}-helper` : undefined;
  const errorNativeId = error ? `${inputNativeId}-error` : undefined;
  const describedBy = [helperNativeId, errorNativeId].filter(Boolean).join(' ') || undefined;

  const webInputProps: Record<string, unknown> = Platform.OS === 'web'
    ? {
      id: inputNativeId,
      'aria-describedby': describedBy,
      'aria-invalid': Boolean(error) || undefined,
    }
    : {};

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label} nativeID={labelNativeId}>
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        {...webInputProps}
        nativeID={inputNativeId}
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={theme.colors.muted.foreground}
        accessibilityLabel={props.accessibilityLabel ?? label}
        accessibilityHint={props.accessibilityHint ?? helperText}
        accessibilityLabelledBy={labelNativeId}
        accessibilityState={{
          disabled: props.editable === false,
        }}
      />
      {error && (
        <Text
          style={styles.errorText}
          nativeID={errorNativeId}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
      {!error && helperText && (
        <Text style={styles.helperText} nativeID={helperNativeId}>
          {helperText}
        </Text>
      )}
    </View>
  );
}
