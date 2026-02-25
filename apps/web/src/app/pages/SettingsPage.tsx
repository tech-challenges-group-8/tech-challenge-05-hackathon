import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { useTheme, ThemeName, themes } from '../../theme';

const rem = (value: string) => Number.parseFloat(value) * 16;
const extractPixels = (value: string) => Number.parseInt(value, 10);

const createStyles = (themeColors: ReturnType<typeof useTheme>['theme']['colors']) =>
  StyleSheet.create({
    card: {
      backgroundColor: themeColors.card.DEFAULT,
      borderRadius: extractPixels(radii.lg),
      padding: rem(space[6]),
      shadowColor: themeColors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: rem(fontSizes['2xl']),
      fontWeight: fontWeights.bold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[2]),
    },
    text: {
      fontSize: rem(fontSizes.sm),
      color: themeColors.foreground,
      lineHeight: rem(fontSizes.sm) * 1.5,
    },
    section: {
      marginBottom: rem(space[6]),
      marginTop: rem(space[6]),
    },
    sectionTitle: {
      fontSize: rem(fontSizes.md),
      fontWeight: fontWeights.semiBold as any,
      color: themeColors.foreground,
      marginBottom: rem(space[3]),
    },
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: rem(space[2]),
    },
    themeOption: {
      flex: 1,
      minWidth: '45%',
      padding: rem(space[3]),
      borderRadius: extractPixels(radii.md),
      borderWidth: 2,
      borderColor: themeColors.border,
      backgroundColor: themeColors.card.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeOptionActive: {
      borderColor: themeColors.primary.DEFAULT,
      backgroundColor: themeColors.cognitive.highlight,
    },
    themeOptionLabel: {
      fontSize: rem(fontSizes.sm),
      fontWeight: fontWeights.semiBold as unknown as 'bold',
      color: themeColors.foreground,
      textAlign: 'center',
    },
    themeOptionLabelActive: {
      color: themeColors.primary.DEFAULT,
      fontWeight: fontWeights.bold as unknown as 'bold',
    },
    previewBox: {
      height: rem(space[8]),
      borderRadius: extractPixels(radii.sm),
      marginTop: rem(space[2]),
      width: '100%',
    },
  });

export function SettingsPage() {
  const { t } = useTranslation();
  const { theme, themeName, setThemeName } = useTheme();
  const styles = useMemo(() => createStyles(theme.colors), [theme.colors]);

  const themeList: { id: ThemeName; label: string }[] = [
    { id: 'light', label: t('settings.theme.light') },
    { id: 'dark', label: t('settings.theme.dark') },
    { id: 'soft-pastel', label: t('settings.theme.softPastel') },
    { id: 'high-contrast', label: t('settings.theme.highContrast') },
  ];

  return (
    <ScrollView>
      <View style={styles.card}>
        <Text style={styles.title}>{t('pages.settings.title')}</Text>
        <Text style={styles.text}>{t('pages.settings.body')}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.theme.title')}</Text>
          <View style={styles.themeGrid}>
            {themeList.map((item) => {
              const themeColors = themes[item.id].colors;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.themeOption,
                    themeName === item.id && styles.themeOptionActive,
                  ]}
                  onPress={() => setThemeName(item.id)}
                >
                  <Text
                    style={[
                      styles.themeOptionLabel,
                      themeName === item.id && styles.themeOptionLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <View
                    style={[
                      styles.previewBox,
                      { backgroundColor: themeColors.primary.DEFAULT },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
