import { FocusSettings } from '../entities/FocusSettings';

export interface IFocusSettingsRepository {
  save(settings: FocusSettings): Promise<void>;
  findByUser(idUser: string): Promise<FocusSettings | null>;
  update(settings: FocusSettings): Promise<void>;
}
