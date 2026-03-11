import { View, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { space } from '@mindease/ui-kit';
import { ToggleRow } from '../ui';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme';
import { rem } from '../../../utils';
import type { FocusMode } from '../../../services';
import { type CognitiveSettingsState } from '../../../cognitive';

interface FocusModeSettingsProps {
  readonly settings: CognitiveSettingsState;
  readonly updateFocusMode: (focusMode: Partial<FocusMode>) => void;
}

const createStyles = () =>
  StyleSheet.create({
    group: {
      gap: rem(space[2]),
    },
  });

export function FocusModeSettings({ settings, updateFocusMode }: FocusModeSettingsProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(), [theme.colors]);

  return (
    <View style={styles.group}>
      <ToggleRow
        title={t('cognitiveSettings.focus.hideSidebar.title')}
        description={t('cognitiveSettings.focus.hideSidebar.description')}
        value={settings.focusMode.hideSidebar}
        onValueChange={(checked) => updateFocusMode({ hideSidebar: checked })}
      />
      <ToggleRow
        title={t('cognitiveSettings.focus.highlightActiveTask.title')}
        description={t('cognitiveSettings.focus.highlightActiveTask.description')}
        value={settings.focusMode.highlightActiveTask}
        onValueChange={(checked) => updateFocusMode({ highlightActiveTask: checked })}
      />
      <ToggleRow
        title={t('cognitiveSettings.focus.animationsEnabled.title')}
        description={t('cognitiveSettings.focus.animationsEnabled.description')}
        value={settings.focusMode.animationsEnabled}
        onValueChange={(checked) => updateFocusMode({ animationsEnabled: checked })}
      />
      <ToggleRow
        title={t('cognitiveSettings.focus.simpleInterface.title')}
        description={t('cognitiveSettings.focus.simpleInterface.description')}
        value={settings.focusMode.simpleInterface}
        onValueChange={(checked) => updateFocusMode({ simpleInterface: checked })}
      />
    </View>
  );
}
