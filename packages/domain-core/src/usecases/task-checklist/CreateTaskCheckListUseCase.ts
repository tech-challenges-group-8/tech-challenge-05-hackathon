import { TaskCheckList } from "../../entities/TaskCheckList";
import { TaskCheckListRepository } from "../../repositories/ITaskCheckListRepository";


export class CreateTaskCheckListUseCase {
  constructor(
    private readonly repository: TaskCheckListRepository,
  ) {}

  async execute(input: {
    id: string;
    idUser: string;
    description: string;
  }): Promise<TaskCheckList> {
    const task = new TaskCheckList(
      input.id,
      input.idUser,
      input.description,
    );

    await this.repository.save(task);
    return task;
  }
}
