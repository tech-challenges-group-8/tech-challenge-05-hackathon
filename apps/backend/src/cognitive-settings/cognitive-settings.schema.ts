import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CognitiveSettingsDocumentType = HydratedDocument<CognitiveSettingsDocument>;

@Schema({ collection: 'cognitivesettings' })
export class CognitiveSettingsDocument {
  @Prop({ required: true, unique: true })
  idUser!: string;

  @Prop({ required: true, default: 'light' })
  themeMode!: string;

  @Prop({ type: Object, required: true, default: {} })
  typography!: {
    fontFamily: string;
    lineHeight: string;
    letterSpacing: string;
    textSize: string;
  };

  @Prop({ type: Object, required: true, default: {} })
  focusMode!: {
    hideSidebar: boolean;
    highlightActiveTask: boolean;
    animationsEnabled: boolean;
    simpleInterface: boolean;
  };

  @Prop({ type: Object, required: true, default: {} })
  sensory!: {
    muteSounds: boolean;
    hideUrgencyIndicators: boolean;
  };

  createdAt!: Date;
  updatedAt!: Date;
}

export const CognitiveSettingsSchema = SchemaFactory.createForClass(CognitiveSettingsDocument);
