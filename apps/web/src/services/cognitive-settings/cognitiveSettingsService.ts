import api from '../api';
import type {
  CognitiveSettings,
  CreateCognitiveSettingsDTO,
  UpdateCognitiveSettingsDTO,
} from './types';

class CognitiveSettingsService {
  /**
   * Create cognitive settings for authenticated user
   * @param settings - Settings data
   * @returns Created settings
   */
  async createSettings(
    settings: CreateCognitiveSettingsDTO
  ): Promise<CognitiveSettings> {
    const response = await api.post<CognitiveSettings>(
      '/cognitive-settings',
      settings
    );
    return response.data;
  }

  /**
   * Get cognitive settings for authenticated user
   * @returns User's cognitive settings
   */
  async getSettings(): Promise<CognitiveSettings> {
    const response = await api.get<CognitiveSettings>('/cognitive-settings');
    return response.data;
  }

  /**
   * Update cognitive settings
   * @param settings - Settings data to update
   * @returns Updated settings
   */
  async updateSettings(
    settings: UpdateCognitiveSettingsDTO
  ): Promise<CognitiveSettings> {
    const response = await api.put<CognitiveSettings>(
      '/cognitive-settings',
      settings
    );
    return response.data;
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
