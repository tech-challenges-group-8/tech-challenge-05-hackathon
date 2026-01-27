import { TaskCheckList } from "../entities/TaskCheckList";

export interface TaskCheckListRepository {
  save(task: TaskCheckList): Promise<void>;
  findById(id: string): Promise<TaskCheckList | null>;
  findByUser(idUser: string): Promise<TaskCheckList[]>;
  update(task: TaskCheckList): Promise<void>;
  delete(id: string): Promise<void>;
}
