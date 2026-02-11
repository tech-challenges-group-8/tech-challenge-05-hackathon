import { TaskKanbanPriority, TaskKanbanStatus } from '@mindease/domain';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskKanbanDocument = HydratedDocument<TaskKanbanModel>;

@Schema({ collection: 'task_kanban' })
export class TaskKanbanModel {
  @Prop({ required: true })
  _id!: string;

  @Prop({ required: true })
  idUser!: string;

  @Prop({ required: true })
  title!: string;

  @Prop()
  description!: string;

  @Prop({ required: true, default: TaskKanbanStatus.Todo })
  status!: TaskKanbanStatus; // TODO, IN_PROGRESS, DONE

  @Prop({ required: true, default: TaskKanbanPriority.Low })
  priority!: TaskKanbanPriority; // TODO, IN_PROGRESS, DONE

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const TaskKanbanSchema = SchemaFactory.createForClass(TaskKanbanModel);
