import { TaskCheckList } from "../../entities/TaskCheckList";
import { TaskCheckListRepository } from "../../repositories/ITaskCheckListRepository";

export class GetTaskCheckListUseCase {
  constructor(
    private readonly repository: TaskCheckListRepository,
  ) {}

  async execute(id: string): Promise<TaskCheckList | null> {
    return this.repository.findById(id);
  }
}
