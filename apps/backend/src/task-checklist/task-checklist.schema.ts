import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskCheckListDocument = HydratedDocument<TaskCheckListModel>;

@Schema({ collection: 'tasks' })
export class TaskCheckListModel {
  @Prop({ required: true })
  _id!: string; // Mapeia para o ID da entidade (UUID)

  @Prop({ required: true })
  idUser!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ default: false })
  completed!: boolean;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const TaskCheckListSchema = SchemaFactory.createForClass(TaskCheckListModel);