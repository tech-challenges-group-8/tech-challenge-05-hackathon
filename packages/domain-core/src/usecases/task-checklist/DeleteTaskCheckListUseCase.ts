import { TaskCheckListRepository } from "../../repositories/ITaskCheckListRepository";

export class DeleteTaskCheckListUseCase {
  constructor(
    private readonly repository: TaskCheckListRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
