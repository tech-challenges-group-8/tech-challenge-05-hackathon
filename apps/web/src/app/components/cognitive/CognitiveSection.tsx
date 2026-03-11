import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, extractPixels } from '../../../utils';

interface CognitiveSectionProps {
  readonly title: string;
  readonly description: string;
  readonly icon: keyof typeof Ionicons.glyphMap;
  readonly isDesktop: boolean;
  readonly expanded: boolean;
  readonly onToggle: () => void;
  readonly children: React.ReactNode;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  isDesktop: boolean,
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    sectionCard: {
      width: isDesktop ? '48.5%' : '100%',
      backgroundColor: themeColors.background,
      borderRadius: extractPixels(radii.lg),
      borderWidth: 1,
      borderColor: themeColors.border,
      padding: rem(space[4]),
      gap: rem(space[4]),
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: rem(space[3]),
    },
    sectionHeaderCopy: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: rem(space[3]),
      flex: 1,
    },
    sectionTitle: {
      fontSize: rem(fontSizes.lg) * preferences.fontScale,
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
    sectionDescription: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      lineHeight: rem(fontSizes.sm) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
    },
  });

export function CognitiveSection({
  title,
  description,
  icon,
  isDesktop,
  expanded,
  onToggle,
  children,
}: CognitiveSectionProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(
    () => createStyles(theme.colors, isDesktop, preferences),
    [theme.colors, isDesktop, preferences],
  );

  if (isDesktop) {
    return (
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderCopy}>
            <Ionicons name={icon} size={20} color={theme.colors.primary.DEFAULT} />
            <View>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.sectionDescription}>{description}</Text>
            </View>
          </View>
        </View>
        {children}
      </View>
    );
  }

  return (
    <View style={styles.sectionCard}>
      <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
        <View style={styles.sectionHeaderCopy}>
          <Ionicons name={icon} size={20} color={theme.colors.primary.DEFAULT} />
          <View>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionDescription}>{description}</Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.colors.muted.foreground}
        />
      </TouchableOpacity>
      {expanded ? children : null}
    </View>
  );
}
