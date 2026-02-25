import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, fontSizes, fontWeights, radii, space } from '@mindease/ui-kit';
import { Ionicons } from '@expo/vector-icons';

// Helper to convert rem to pixels (assuming 16px base)
const rem = (value: string) => parseFloat(value) * 16;

const styles = StyleSheet.create({
  header: {
    height: rem(space[16]),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: rem(space[6]),
  },
  headerTitle: {
    fontSize: rem(fontSizes.xl),
    fontWeight: fontWeights.semiBold,
    color: colors.foreground,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: rem(space[10]),
    height: rem(space[10]),
    marginLeft: rem(space[3]),
    borderRadius: parseInt(radii.full),
    backgroundColor: colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonIcon: {
    color: colors.primary.foreground,
  },
  headerButtonSecondary: {
    backgroundColor: colors.secondary.DEFAULT,
  },
  headerButtonSecondaryIcon: {
    color: colors.secondary.foreground,
  },
});

interface HeaderProps {
  title: string;
  onNewTask?: () => void;
  onProfile?: () => void;
}

export function Header({ title, onNewTask, onProfile }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onNewTask}
          accessibilityLabel={t('header.newTask')}
        >
          <Ionicons
            name="add"
            size={rem(fontSizes.lg)}
            style={styles.headerButtonIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, styles.headerButtonSecondary]}
          onPress={onProfile}
          accessibilityLabel={t('header.profile')}
        >
          <Ionicons
            name="person-circle"
            size={rem(fontSizes.lg)}
            style={styles.headerButtonSecondaryIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
