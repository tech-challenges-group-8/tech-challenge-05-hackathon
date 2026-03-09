import { FocusSettings } from '../../entities/FocusSettings';
import { FocusTask } from '../../entities/FocusTask';
import { AudioTheme } from '../../entities/AudioTheme';
import { IFocusSettingsRepository } from '../../repositories/IFocusSettingsRepository';

export class UpdateFocusSettingsUseCase {
  constructor(private readonly repository: IFocusSettingsRepository) {}

  async execute(input: {
    idUser: string;
    foco?: number;
    pausaCurta?: number;
    pausaLonga?: number;
    pomodorosCompleted?: number;
    tasks?: FocusTask[];
    audioThemes?: AudioTheme[];
  }): Promise<FocusSettings> {
    const settings = await this.repository.findByUser(input.idUser);

    if (!settings) {
      throw new Error('Focus settings not found for this user');
    }

    if (input.foco !== undefined) settings.foco = input.foco;
    if (input.pausaCurta !== undefined) settings.pausaCurta = input.pausaCurta;
    if (input.pausaLonga !== undefined) settings.pausaLonga = input.pausaLonga;
    if (input.pomodorosCompleted !== undefined) settings.pomodorosCompleted = input.pomodorosCompleted;
    if (input.tasks !== undefined) settings.tasks = input.tasks;
    if (input.audioThemes !== undefined) settings.audioThemes = input.audioThemes;

    await this.repository.update(settings);
    return settings;
  }
}