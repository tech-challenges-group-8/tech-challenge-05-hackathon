import { CognitiveSettings } from '../../entities/cognitive-settings/CognitiveSettings';
import { ICognitiveSettingsRepository } from '../../repositories/ICognitiveSettingsRepository';

export class GetCognitiveSettingsUseCase {
  constructor(private readonly repository: ICognitiveSettingsRepository) {}

  async execute(idUser: string): Promise<CognitiveSettings | null> {
    return this.repository.findByUser(idUser);
  }
}
