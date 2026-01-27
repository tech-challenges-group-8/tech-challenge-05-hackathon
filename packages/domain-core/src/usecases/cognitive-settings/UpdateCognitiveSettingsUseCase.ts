import { CognitiveSettings } from '../../entities/cognitive-settings/CognitiveSettings';
import { ICognitiveSettingsRepository } from '../../repositories/ICognitiveSettingsRepository';
import { ThemeMode } from '../../entities/cognitive-settings/enums/ThemeModeEnum';
import { TypographySettings } from '../../entities/cognitive-settings/value-objects/TypographySettingsVO';
import { FocusModeSettings } from '../../entities/cognitive-settings/value-objects/FocusModeSettingsVO';
import { SensorySettings } from '../../entities/cognitive-settings/value-objects/SensorySettingsVO';

export interface UpdateCognitiveSettingsInput {
  idUser: string;
  themeMode?: ThemeMode;
  typography?: TypographySettings;
  focusMode?: FocusModeSettings;
  sensory?: SensorySettings;
}

export class UpdateCognitiveSettingsUseCase {
  constructor(private readonly repository: ICognitiveSettingsRepository) {}

  async execute(input: UpdateCognitiveSettingsInput): Promise<CognitiveSettings> {
    const settings = await this.repository.findByUser(input.idUser);

    if (!settings) {
      throw new Error('Cognitive settings not found');
    }

    if (input.themeMode) settings.themeMode = input.themeMode;
    if (input.typography) settings.typography = input.typography;
    if (input.focusMode) settings.focusMode = input.focusMode;
    if (input.sensory) settings.sensory = input.sensory;

    await this.repository.update(settings);
    return settings;
  }
}
