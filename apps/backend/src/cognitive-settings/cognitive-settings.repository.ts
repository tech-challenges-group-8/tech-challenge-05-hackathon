import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CognitiveSettingsDocument, CognitiveSettingsDocumentType } from './cognitive-settings.schema';

export interface CognitiveSettingsRecord {
  id: string;
  idUser: string;
  themeMode: string;
  typography: {
    fontFamily: string;
    lineHeight: string;
    letterSpacing: string;
    textSize: string;
  };
  focusMode: {
    hideSidebar: boolean;
    highlightActiveTask: boolean;
    animationsEnabled: boolean;
    simpleInterface: boolean;
  };
  sensory: {
    muteSounds: boolean;
    hideUrgencyIndicators: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class CognitiveSettingsRepository {
  constructor(
    @InjectModel(CognitiveSettingsDocument.name)
    private readonly cognitiveSettingsModel: Model<CognitiveSettingsDocumentType>
  ) {}

  private toRecord(doc: CognitiveSettingsDocumentType): CognitiveSettingsRecord {
    return {
      id: doc.id,
      idUser: doc.idUser,
      themeMode: doc.themeMode,
      typography: doc.typography,
      focusMode: doc.focusMode,
      sensory: doc.sensory,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findByUserId(idUser: string): Promise<CognitiveSettingsRecord | null> {
    const doc = await this.cognitiveSettingsModel.findOne({ idUser }).exec();
    return doc ? this.toRecord(doc) : null;
  }

  async create(input: {
    idUser: string;
    themeMode?: string;
    typography?: object;
    focusMode?: object;
    sensory?: object;
  }): Promise<CognitiveSettingsRecord> {
    const doc = await this.cognitiveSettingsModel.create({
      idUser: input.idUser,
      themeMode: input.themeMode || 'light',
      typography: input.typography || {
        fontFamily: 'system',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        textSize: 'normal',
      },
      focusMode: input.focusMode || {
        hideSidebar: false,
        highlightActiveTask: false,
        animationsEnabled: true,
        simpleInterface: false,
      },
      sensory: input.sensory || {
        muteSounds: false,
        hideUrgencyIndicators: false,
      },
    });
    return this.toRecord(doc);
  }

  async update(
    idUser: string,
    update: {
      themeMode?: string;
      typography?: object;
      focusMode?: object;
      sensory?: object;
    }
  ): Promise<CognitiveSettingsRecord | null> {
    const doc = await this.cognitiveSettingsModel
      .findOneAndUpdate({ idUser }, { $set: update }, { new: true })
      .exec();

    return doc ? this.toRecord(doc) : null;
  }

  async delete(idUser: string): Promise<boolean> {
    const result = await this.cognitiveSettingsModel.deleteOne({ idUser }).exec();
    return result.deletedCount === 1;
  }
}
