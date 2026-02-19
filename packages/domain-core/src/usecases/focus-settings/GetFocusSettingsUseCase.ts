import { FocusSettings } from '../../entities/FocusSettings';
import { IFocusSettingsRepository } from '../../repositories/IFocusSettingsRepository';

export class GetFocusSettingsUseCase {
  constructor(private readonly repository: IFocusSettingsRepository) {}

  async execute(idUser: string): Promise<FocusSettings | null> {
    return this.repository.findByUser(idUser);
  }
}