import { FocusSettings } from '../../entities/FocusSettings';
import { IFocusSettingsRepository } from '../../repositories/IFocusSettingsRepository';

export class CreateFocusSettingsUseCase {
  constructor(private readonly repository: IFocusSettingsRepository) {}

  async execute(input: {
    idUser: string;
    foco?: number;
    pausaCurta?: number;
    pausaLonga?: number;
    pomodorosCompleted?: number;
  }): Promise<FocusSettings> {
    const settings = new FocusSettings(
      input.idUser,
      input.foco,
      input.pausaCurta,
      input.pausaLonga,
      input.pomodorosCompleted
    );

    await this.repository.save(settings);
    return settings;
  }
}