import { TaskCheckList } from "../../entities/TaskCheckList";
import { TaskCheckListRepository } from "../../repositories/ITaskCheckListRepository";

export interface UpdateTaskCheckListInput {
  id: string;
  description?: string;
  isDone?: boolean;
}

export class UpdateTaskCheckListUseCase {
  constructor(
    private readonly repository: TaskCheckListRepository,
  ) {}

  async execute(input: UpdateTaskCheckListInput): Promise<TaskCheckList> {
    const taskCheckList = await this.repository.findById(input.id);

    if (!taskCheckList) {
      throw new Error("TaskCheckList not found");
    }

    if (input.description !== undefined) {
      taskCheckList.updateDescription(input.description);
    }

    if (input.isDone !== undefined) {
      taskCheckList.setDone(input.isDone);
    }

    await this.repository.update(taskCheckList);
    return taskCheckList;
  }
}
