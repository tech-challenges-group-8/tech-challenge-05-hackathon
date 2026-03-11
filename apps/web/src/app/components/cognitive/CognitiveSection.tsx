import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, extractPixels, fontWeight } from '../../../utils';

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
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: rem(space[3]),
    },
    sectionHeaderCopy: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: rem(space[3]),
      flex: 1,
      minWidth: 0,
    },
    sectionTextGroup: {
      flex: 1,
      minWidth: 0,
    },
    sectionTitle: {
      fontSize: rem(fontSizes.lg) * preferences.fontScale,
      fontWeight: fontWeight(fontWeights.semiBold),
      color: themeColors.foreground,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      flexShrink: 1,
    },
    sectionDescription: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      color: themeColors.muted.foreground,
      lineHeight: rem(fontSizes.sm) * preferences.lineHeightMultiplier,
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      flexShrink: 1,
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
  const { t } = useTranslation();
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(
    () => createStyles(theme.colors, isDesktop, preferences),
    [theme.colors, isDesktop, preferences],
  );
  const webHiddenProps: Record<string, unknown> = Platform.OS === 'web' ? { 'aria-hidden': true } : {};
  const expandedState = expanded
    ? t('accessibility.cognitive.states.expanded')
    : t('accessibility.cognitive.states.collapsed');
  const toggleLabel = t('accessibility.cognitive.sectionToggle', {
    section: title,
    state: expandedState,
  });

  if (isDesktop) {
    return (
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderCopy}>
            <Ionicons
              name={icon}
              size={20}
              color={theme.colors.primary.DEFAULT}
              accessibilityElementsHidden
              importantForAccessibility="no"
              {...webHiddenProps}
            />
            <View style={styles.sectionTextGroup}>
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
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={toggleLabel}
        accessibilityHint={
          expanded
            ? t('accessibility.cognitive.sectionHintCollapse')
            : t('accessibility.cognitive.sectionHintExpand')
        }
      >
        <View style={styles.sectionHeaderCopy}>
          <Ionicons
            name={icon}
            size={20}
            color={theme.colors.primary.DEFAULT}
            accessibilityElementsHidden
            importantForAccessibility="no"
            {...webHiddenProps}
          />
          <View style={styles.sectionTextGroup}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionDescription}>{description}</Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={theme.colors.muted.foreground}
          accessibilityElementsHidden
          importantForAccessibility="no"
          {...webHiddenProps}
        />
      </TouchableOpacity>
      {expanded ? children : null}
    </View>
  );
}
