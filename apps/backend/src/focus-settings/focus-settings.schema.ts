import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FocusSettingsDocument = HydratedDocument<FocusSettingsModel>;

@Schema({ collection: 'focus_settings' })
export class FocusSettingsModel {
  @Prop({ required: true, unique: true })
  idUser!: string;

  @Prop({ required: true, default: 25 })
  foco!: number;

  @Prop({ required: true, default: 5 })
  pausaCurta!: number;

  @Prop({ required: true, default: 15 })
  pausaLonga!: number;
}

export const FocusSettingsSchema = SchemaFactory.createForClass(FocusSettingsModel);
