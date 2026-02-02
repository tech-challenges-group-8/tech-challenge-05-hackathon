import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CognitiveSettingsController } from './cognitive-settings.controller';
import { CognitiveSettingsService } from './cognitive-settings.service';
import { CognitiveSettingsRepository } from './cognitive-settings.repository';
import { CognitiveSettingsDocument, CognitiveSettingsSchema } from './cognitive-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CognitiveSettingsDocument.name, schema: CognitiveSettingsSchema },
    ]),
  ],
  controllers: [CognitiveSettingsController],
  providers: [CognitiveSettingsRepository, CognitiveSettingsService],
  exports: [CognitiveSettingsService],
})
export class CognitiveSettingsModule {}
