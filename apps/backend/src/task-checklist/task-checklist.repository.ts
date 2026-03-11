import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskCheckList, TaskCheckListRepository } from '@mindease/domain';
import { TaskCheckListDocument, TaskCheckListModel } from './task-checklist.schema';

type LegacyTaskCheckListDocument = TaskCheckListDocument & {
  title?: string;
};

@Injectable()
export class TaskCheckListRepositoryMongoose implements TaskCheckListRepository {
  constructor(
    @InjectModel(TaskCheckListModel.name)
    private taskModel: Model<TaskCheckListDocument>,
  ) {}

  async save(task: TaskCheckList): Promise<void> {
    await this.taskModel.findOneAndUpdate(
      { _id: task.id },
      {
        idUser: task.idUser,
        description: task.description,
        completed: task.completed,
        pomodoros: task.pomodoros,
        timeSpent: task.timeSpent,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
      { upsert: true, new: true },
    ).exec();
  }

  async findById(id: string): Promise<TaskCheckList | null> {
    const doc = await this.taskModel.findById(id).exec();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findByUser(idUser: string): Promise<TaskCheckList[]> {
    const docs = await this.taskModel.find({ idUser }).exec();
    return docs
      .map((doc) => this.toEntity(doc))
      .filter((task): task is TaskCheckList => task !== null);
  }

  async update(task: TaskCheckList): Promise<void> {
    await this.save(task);
  }

  async delete(id: string): Promise<void> {
    await this.taskModel.deleteOne({ _id: id }).exec();
  }

  private toEntity(doc: TaskCheckListDocument): TaskCheckList | null {
    const legacyDoc = doc as LegacyTaskCheckListDocument;
    const description = legacyDoc.description ?? legacyDoc.title;

    if (!description || description.trim().length === 0) {
      return null;
    }

    const createdAt = doc.createdAt ?? new Date();
    const updatedAt = doc.updatedAt ?? createdAt;

    const task = new TaskCheckList(
      String(doc._id),
      doc.idUser,
      description,
      doc.completed,
      doc.pomodoros || 0,
      doc.timeSpent || 0,
      createdAt
    );
    // Força a atualização da data de update que pode não estar no construtor da entidade dependendo da versão
    task.updatedAt = updatedAt;
    return task;
  }
}