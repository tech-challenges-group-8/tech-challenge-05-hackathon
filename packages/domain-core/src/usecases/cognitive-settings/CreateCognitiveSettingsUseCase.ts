import { CognitiveSettings } from '../../entities/cognitive-settings/CognitiveSettings';


export interface ICognitiveSettingsRepository {
  save(settings: CognitiveSettings): Promise<void>;
  findByUser(idUser: string): Promise<CognitiveSettings | null>;
  update(settings: CognitiveSettings): Promise<void>;
}
