import api from '../api';
import type {
  UpdateFocusSettingsDTO,
  ResponseFocusSettingsDTO,
} from './types';

class FocusSettingsService {
  /**
   * Get focus timer settings for authenticated user
   * @returns Focus settings or creates default ones if not found
   */
  async getSettings(): Promise<ResponseFocusSettingsDTO> {
    const response = await api.get<ResponseFocusSettingsDTO>('/focus-settings');
    return response.data;
  }

  /**
   * Update focus timer settings
   * @param settings - Settings data to update
   * @returns Updated settings
   */
  async updateSettings(
    settings: Partial<UpdateFocusSettingsDTO>
  ): Promise<ResponseFocusSettingsDTO> {
    const response = await api.put<ResponseFocusSettingsDTO>(
      '/focus-settings',
      settings
    );
    return response.data;
  }

  /**
   * Set pomodoro timer durations
   * @param focoDuration - Focus session duration in minutes
   * @param shortBreakDuration - Short break duration in minutes
   * @param longBreakDuration - Long break duration in minutes
   * @returns Updated settings
   */
  async setPomodoroDurations(
    focoDuration: number,
    shortBreakDuration: number,
    longBreakDuration: number
  ): Promise<ResponseFocusSettingsDTO> {
    return this.updateSettings({
      foco: focoDuration,
      pausaCurta: shortBreakDuration,
      pausaLonga: longBreakDuration,
    });
  }

  /**
   * Increment the completed pomodoro count
   * @param currentCount - current amount of completed pomodoros
   * @returns Updated settings
   */
  async incrementPomodoroCount(
    currentCount: number
  ): Promise<ResponseFocusSettingsDTO> {
    return this.updateSettings({
      pomodorosCompleted: currentCount + 1,
    });
  }

  /**
   * Update the tasks list
   */
  async updateTasks(tasks: ResponseFocusSettingsDTO['tasks']): Promise<ResponseFocusSettingsDTO> {
    return this.updateSettings({ tasks });
  }

  /**
   * Update the custom audio themes list
   */
  async updateAudioThemes(audioThemes: ResponseFocusSettingsDTO['audioThemes']): Promise<ResponseFocusSettingsDTO> {
    return this.updateSettings({ audioThemes });
  }

  /**
   * Get default pomodoro settings
   * @returns Default settings
   */
  getDefaultSettings(): ResponseFocusSettingsDTO {
    return {
      foco: 25,
      pausaCurta: 5,
      pausaLonga: 15,
      pomodorosCompleted: 0,
      tasks: [],
      audioThemes: [],
    };
  }
}

export default new FocusSettingsService();
