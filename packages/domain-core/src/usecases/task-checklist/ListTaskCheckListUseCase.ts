import { TaskCheckList } from "../../entities/TaskCheckList";
import { TaskCheckListRepository } from "../../repositories/ITaskCheckListRepository";

export class ListTaskCheckListUseCase {
  constructor(
    private readonly repository: TaskCheckListRepository,
  ) {}

  async execute(idUser: string): Promise<TaskCheckList[]> {
    return this.repository.findByUser(idUser);
  }
}
