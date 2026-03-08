import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

@Schema({ _id: false })
export class FocusTaskModel {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  completed!: boolean;

  @Prop({ required: false, default: 0 })
  timeSpent?: number;

  @Prop({ required: false, default: 0 })
  pomodoros?: number;
}
export const FocusTaskSchema = SchemaFactory.createForClass(FocusTaskModel);

@Schema({ _id: false })
export class AudioThemeModel {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, default: '' })
  videoId!: string;
}
export const AudioThemeSchema = SchemaFactory.createForClass(AudioThemeModel);

@Schema({ _id: false })
export class FocusSessionModel {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  duration!: number;

  @Prop({ required: false })
  taskId?: string;

  @Prop({ required: true })
  createdAt!: Date;
}
export const FocusSessionSchema = SchemaFactory.createForClass(FocusSessionModel);

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

  @Prop({ required: true, default: 0 })
  pomodorosCompleted!: number;

  @Prop({ type: [FocusTaskSchema], default: [] })
  tasks!: FocusTaskModel[];

  @Prop({ type: [AudioThemeSchema], default: [] })
  audioThemes!: AudioThemeModel[];

  @Prop({ type: [FocusSessionSchema], default: [] })
  sessions!: FocusSessionModel[];
}

export const FocusSettingsSchema = SchemaFactory.createForClass(FocusSettingsModel);
