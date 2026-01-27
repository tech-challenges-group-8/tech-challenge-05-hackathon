import { FocusSettings } from '../../entities/FocusSettings';
import { IFocusSettingsRepository } from '../../repositories/IFocusSettingsRepository';

export class UpdateFocusSettingsUseCase {
  constructor(private readonly repository: IFocusSettingsRepository) {}

  async execute(input: {
    idUser: string;
    foco?: number;
    pausaCurta?: number;
    pausaLonga?: number;
  }): Promise<FocusSettings> {
    const settings = await this.repository.findByUser(input.idUser);

    if (!settings) {
      throw new Error('Focus settings not found for this user');
    }

    if (input.foco !== undefined) settings.foco = input.foco;
    if (input.pausaCurta !== undefined) settings.pausaCurta = input.pausaCurta;
    if (input.pausaLonga !== undefined) settings.pausaLonga = input.pausaLonga;

    await this.repository.update(settings);
    return settings;
  }
}