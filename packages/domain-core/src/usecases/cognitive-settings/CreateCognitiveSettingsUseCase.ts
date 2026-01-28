import { ICognitiveSettingsRepository } from "../../repositories/ICognitiveSettingsRepository";
import { CognitiveSettings } from "../../entities/cognitive-settings/CognitiveSettings";

export interface CreateCognitiveSettingsInput {
  idUser: string;
}

export class CreateCognitiveSettingsUseCase {
  constructor(private readonly repository: ICognitiveSettingsRepository) {}

  async execute(input: CreateCognitiveSettingsInput): Promise<CognitiveSettings> {
    const settings = new CognitiveSettings(input.idUser);
    await this.repository.save(settings);
    return settings;
  }
}
