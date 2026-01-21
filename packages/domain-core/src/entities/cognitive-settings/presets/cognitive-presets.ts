
import { CognitiveSettings } from '../cognitive-settings.entity';
import { CognitivePreset } from '../enums/cognitive-preset.enum';
import { FontFamily } from '../enums/font-family.enum';
import { LetterSpacing } from '../enums/letter-spacing.enum';
import { LineHeight } from '../enums/line-height.enum';
import { TextSize } from '../enums/text-size.enum';
import { ThemeMode } from '../enums/theme-mode.enum';
import { FocusModeSettings } from '../value-objects/focus-mode-settings.vo';
import { SensorySettings } from '../value-objects/sensory-settings.vo';
import { TypographySettings } from '../value-objects/typography-settings.vo';

export const DEFAULT_COGNITIVE_SETTINGS = CognitiveSettings.default();

export const COGNITIVE_PRESETS: Record<CognitivePreset, CognitiveSettings> = {
    [CognitivePreset.Default]: DEFAULT_COGNITIVE_SETTINGS,

    [CognitivePreset.Reading]: new CognitiveSettings(
        ThemeMode.Light,
        new TypographySettings(
            FontFamily.DyslexiaFriendly,
            LineHeight.Loose,
            LetterSpacing.Wide,
            TextSize.Large,
        ),
    ),

    [CognitivePreset.Focus]: new CognitiveSettings(
        ThemeMode.Light,
        new TypographySettings(
            FontFamily.System,
            LineHeight.Relaxed,
            LetterSpacing.Normal,
            TextSize.Normal,
        ),
        new FocusModeSettings(
            true,
            true,
            false,
            true,
        ),
        new SensorySettings(
            true,
            false,
        ),
    ),

    [CognitivePreset.Sensory]: new CognitiveSettings(
        ThemeMode.SoftPastel,
        undefined,
        new FocusModeSettings(
            false,
            false,
            false,
            false,
        ),
        new SensorySettings(
            true,
            true,
        ),
    ),

    [CognitivePreset.Emotion]: new CognitiveSettings(
        ThemeMode.SoftPastel,
        undefined,
        undefined,
        new SensorySettings(
            false,
            true,
        ),
    ),
};
