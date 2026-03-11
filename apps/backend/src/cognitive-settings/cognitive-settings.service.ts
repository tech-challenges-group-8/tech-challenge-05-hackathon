import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CognitiveSettings } from '@mindease/domain';
import { CognitiveSettingsRepository, CognitiveSettingsRecord } from './cognitive-settings.repository';
import { ThemeMode } from '@mindease/domain';
import { TypographySettings } from '@mindease/domain';
import { FocusModeSettings } from '@mindease/domain';
import { SensorySettings } from '@mindease/domain';

@Injectable()
export class CognitiveSettingsService {
  constructor(private readonly repository: CognitiveSettingsRepository) {}

  async createSettings(
    idUser: string,
    themeMode?: string,
    typography?: any,
    focusMode?: any,
    sensory?: any
  ): Promise<CognitiveSettings> {
    const existing = await this.repository.findByUserId(idUser);
    if (existing) {
      throw new ConflictException('Cognitive settings already exist for this user');
    }

    const record = await this.repository.create({
      idUser,
      themeMode,
      typography,
      focusMode,
      sensory,
    });

    return this.toDomain(record);
  }

  async getSettingsByUserId(idUser: string): Promise<CognitiveSettings | null> {
    const record = await this.repository.findByUserId(idUser);
    return record ? this.toDomain(record) : null;
  }

  async updateSettings(
    idUser: string,
    themeMode?: string,
    typography?: any,
    focusMode?: any,
    sensory?: any
  ): Promise<CognitiveSettings> {
    const update: any = {};
    if (themeMode !== undefined) update.themeMode = themeMode;
    if (typography !== undefined) update.typography = typography;
    if (focusMode !== undefined) update.focusMode = focusMode;
    if (sensory !== undefined) update.sensory = sensory;

    const record = await this.repository.update(idUser, update);
    if (!record) {
      throw new NotFoundException('Failed to save settings');
    }

    return this.toDomain(record);
  }

  async deleteSettings(idUser: string): Promise<boolean> {
    const existing = await this.repository.findByUserId(idUser);
    if (!existing) {
      throw new NotFoundException('Cognitive settings not found for this user');
    }

    return this.repository.delete(idUser);
  }

  private toDomain(record: CognitiveSettingsRecord): CognitiveSettings {
    const typography = new TypographySettings(
      record.typography.fontFamily as any,
      record.typography.lineHeight as any,
      record.typography.letterSpacing as any,
      record.typography.textSize as any
    );

    const focusMode = new FocusModeSettings(
      record.focusMode.hideSidebar,
      record.focusMode.highlightActiveTask,
      record.focusMode.animationsEnabled,
      record.focusMode.simpleInterface
    );

    const sensory = new SensorySettings(
      record.sensory.muteSounds,
      record.sensory.hideUrgencyIndicators
    );

    return new CognitiveSettings(
      record.idUser,
      record.themeMode as ThemeMode,
      typography,
      focusMode,
      sensory
    );
  }
}
