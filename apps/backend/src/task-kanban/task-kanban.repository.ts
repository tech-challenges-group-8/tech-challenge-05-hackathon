import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskKanban, ITaskKanbanRepository } from '@mindease/domain';
import { TaskKanbanDocument, TaskKanbanModel } from './task-kanban.schema';

@Injectable()
export class TaskKanbanRepositoryMongoose implements ITaskKanbanRepository {
  constructor(
    @InjectModel(TaskKanbanModel.name)
    private taskModel: Model<TaskKanbanDocument>,
  ) {}

  async save(task: TaskKanban): Promise<void> {
    await this.taskModel.findOneAndUpdate(
      { _id: task.id },
      {
        idUser: task.idUser,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
      { upsert: true, new: true },
    ).exec();
  }

  async findById(id: string): Promise<TaskKanban | null> {
    const doc = await this.taskModel.findById(id).exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByUser(idUser: string): Promise<TaskKanban[]> {
    const docs = await this.taskModel.find({ idUser }).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async update(task: TaskKanban): Promise<void> {
    await this.save(task);
  }

  async delete(id: string): Promise<void> {
    await this.taskModel.deleteOne({ _id: id }).exec();
  }

  private toEntity(doc: TaskKanbanDocument): TaskKanban {
    const task = new TaskKanban(
        doc._id, 
        doc.idUser, 
        doc.title,
        doc.status, 
        doc.priority,
        doc.createdAt
    );
    task.updatedAt = doc.updatedAt;
    return task;
  }
}
