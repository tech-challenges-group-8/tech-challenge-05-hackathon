import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fontSizes, radii, space } from '@mindease/ui-kit';
import { useCognitivePreferences } from '../../../cognitive';
import { useTheme } from '../../../theme';
import { rem, extractPixels } from '../../../utils';

interface OptionButtonProps {
  value: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  previewColor?: string;
  description?: string;
}

const createStyles = (
  themeColors: ReturnType<typeof useTheme>['theme']['colors'],
  preferences: ReturnType<typeof useCognitivePreferences>,
) =>
  StyleSheet.create({
    button: {
      flex: 1,
      width: '100%',
      minWidth: 0,
      minHeight: rem(space[10]),
      paddingHorizontal: rem(space[3]),
      paddingVertical: rem(space[3]),
      borderRadius: extractPixels(radii.lg),
      borderWidth: 2,
      borderColor: themeColors.border,
      backgroundColor: themeColors.background,
      alignItems: 'center',
      justifyContent: 'center',
      gap: rem(space[2]),
    },
    buttonActive: {
      borderColor: themeColors.primary.DEFAULT,
      backgroundColor: themeColors.primary.DEFAULT,
    },
    content: {
      alignItems: 'center',
      gap: rem(space[1]),
      width: '100%',
      minWidth: 0,
    },
    label: {
      fontSize: rem(fontSizes.sm) * preferences.fontScale,
      fontWeight: '600' as any,
      color: themeColors.foreground,
      textAlign: 'center',
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      flexShrink: 1,
    },
    labelActive: {
      color: themeColors.primary.foreground,
    },
    description: {
      fontSize: rem(fontSizes.xs) * preferences.fontScale,
      color: themeColors.muted.foreground,
      textAlign: 'center',
      letterSpacing: preferences.letterSpacing,
      fontFamily: preferences.fontFamily,
      flexShrink: 1,
    },
    descriptionActive: {
      color: themeColors.primary.foreground,
    },
    previewColor: {
      width: rem(space[5]),
      height: rem(space[5]),
      borderRadius: extractPixels(radii.full),
      borderWidth: 2,
      borderColor: themeColors.border,
      marginTop: rem(space[1]),
    },
    previewColorActive: {
      borderColor: themeColors.primary.foreground,
    },
  });

export function OptionButton({
  value,
  label,
  isActive,
  onPress,
  icon,
  previewColor,
  description,
}: OptionButtonProps) {
  const { theme } = useTheme();
  const preferences = useCognitivePreferences();
  const styles = useMemo(() => createStyles(theme.colors, preferences), [preferences, theme.colors]);

  return (
    <TouchableOpacity style={[styles.button, isActive && styles.buttonActive]} onPress={onPress}>
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={isActive ? theme.colors.primary.foreground : theme.colors.foreground}
        />
      ) : null}
      <View style={styles.content}>
        <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
        {description ? (
          <Text style={[styles.description, isActive && styles.descriptionActive]}>
            {description}
          </Text>
        ) : null}
      </View>
      {previewColor ? (
        <View
          style={[
            styles.previewColor,
            { backgroundColor: previewColor },
            isActive && styles.previewColorActive,
          ]}
        />
      ) : null}
    </TouchableOpacity>
  );
}
