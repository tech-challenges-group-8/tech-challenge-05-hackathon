import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FocusSettings, IFocusSettingsRepository } from '@mindease/domain';
import { FocusSettingsDocument, FocusSettingsModel } from './focus-settings.schema';

@Injectable()
export class FocusSettingsRepositoryMongoose implements IFocusSettingsRepository {
  constructor(
    @InjectModel(FocusSettingsModel.name)
    private settingsModel: Model<FocusSettingsDocument>,
  ) {}

  async update(settings: FocusSettings): Promise<void> {
    await this.save(settings);
  }

  async save(settings: FocusSettings): Promise<void> {
    await this.settingsModel.findOneAndUpdate(
      { idUser: settings.idUser },
      {
        foco: settings.foco,
        pausaCurta: settings.pausaCurta,
        pausaLonga: settings.pausaLonga,
      },
      { upsert: true, new: true },
    ).exec();
  }

  async findByUser(idUser: string): Promise<FocusSettings | null> {
    const doc = await this.settingsModel.findOne({ idUser }).exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  private toEntity(doc: FocusSettingsDocument): FocusSettings {
    const settings = new FocusSettings(
        doc.idUser,
        doc.foco,
        doc.pausaCurta,
        doc.pausaLonga,
    );
    return settings;
  }
}
