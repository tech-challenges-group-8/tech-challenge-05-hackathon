import api from '../api';
import type {
  CognitiveSettings,
  UpdateCognitiveSettingsDTO,
} from './types';
import { normalizeCognitiveSettings } from '../../cognitive/model';

type CognitiveSettingsApiResponse = Partial<CognitiveSettings> & {
  idUser?: string;
};

function mapSettings(response: CognitiveSettingsApiResponse): CognitiveSettings {
  return normalizeCognitiveSettings(
    {
      ...response,
      userId: response.userId ?? response.idUser,
    },
    response.userId ?? response.idUser,
  );
}

class CognitiveSettingsService {
  /**
   * Get cognitive settings for authenticated user
   * @returns User's cognitive settings
   */
  async getSettings(): Promise<CognitiveSettings> {
    const response = await api.get<CognitiveSettingsApiResponse>('/cognitive-settings');
    return mapSettings(response.data);
  }

  /**
   * Update cognitive settings
   * @param settings - Settings data to update
   * @returns Updated settings
   */
  async updateSettings(
    settings: UpdateCognitiveSettingsDTO
  ): Promise<CognitiveSettings> {
    const response = await api.put<CognitiveSettingsApiResponse>(
      '/cognitive-settings',
      settings
    );
    return mapSettings(response.data);
  }

  /**
   * Delete cognitive settings
   * @returns Success status
   */
  async deleteSettings(): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      '/cognitive-settings'
    );
    return response.data;
  }
}

export default new CognitiveSettingsService();
