import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme';
import { rem, fontWeight } from '../../../utils';
import { fontSizes, fontWeights, space } from '@mindease/ui-kit';
import { Card } from './Card';

interface AuthFormLayoutProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly helperText?: string;
  readonly children: React.ReactNode;
  readonly switchLabel?: string;
  readonly onSwitchClick?: () => void;
  readonly switchAccessibilityLabel?: string;
}

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: rem(space[6]),
      backgroundColor: themeColors.background,
    },
    scrollContent: {
      width: '100%',
      maxWidth: 580,
      minWidth: 400,
      paddingVertical: rem(space[4]),
    },
    title: {
      fontSize: rem(fontSizes['3xl']),
      fontWeight: fontWeight(fontWeights.bold),
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
      textAlign: 'center',
    },
    subtitle: {
      fontSize: rem(fontSizes.md),
      color: themeColors.muted.foreground,
      marginBottom: rem(space[6]),
      textAlign: 'center',
    },
    switchModeContainer: {
      marginTop: rem(space[4]),
    },
    switchModeText: {
      color: themeColors.primary.DEFAULT,
      fontWeight: fontWeight(fontWeights.semiBold),
      fontSize: rem(fontSizes.sm),
      textAlign: 'center',
    },
    helperText: {
      fontSize: rem(fontSizes.xs),
      color: themeColors.muted.foreground,
      textAlign: 'center',
      marginTop: rem(space[4]),
    },
  });

export function AuthFormLayout({
  title,
  subtitle,
  helperText,
  children,
  switchLabel,
  onSwitchClick,
  switchAccessibilityLabel,
}: AuthFormLayoutProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={false}>
        <Card>
          <Text
            style={styles.title}
            accessibilityRole="header"
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={styles.subtitle}
              accessibilityRole="header"
            >
              {subtitle}
            </Text>
          )}

          {children}

          {switchLabel && onSwitchClick && (
            <View style={styles.switchModeContainer}>
              <TouchableOpacity
                accessibilityRole="link"
                accessibilityLabel={switchAccessibilityLabel ?? switchLabel}
                onPress={onSwitchClick}
              >
                <Text style={styles.switchModeText}>{switchLabel}</Text>
              </TouchableOpacity>
            </View>
          )}

          {helperText && <Text style={styles.helperText}>{helperText}</Text>}
        </Card>
      </ScrollView>
    </View>
  );
}
