import { TaskCheckList } from "../../entities/TaskCheckList";
import { TaskCheckListRepository } from "../../repositories/ITaskCheckListRepository";

export interface UpdateTaskCheckListInput {
  id: string;
  description?: string;
  isDone?: boolean;
  pomodoros?: number;
  timeSpent?: number;
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

    if (input.pomodoros !== undefined) {
      taskCheckList.pomodoros = input.pomodoros;
    }

    if (input.timeSpent !== undefined) {
      taskCheckList.timeSpent = input.timeSpent;
    }

    await this.repository.update(taskCheckList);
    return taskCheckList;
  }
}
