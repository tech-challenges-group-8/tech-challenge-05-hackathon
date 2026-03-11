export class ResponseTaskCheckListDto {
    id: string;
    description: string;
    completed: boolean;
    pomodoros: number;
    timeSpent: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
      id: string,
      description: string,
      completed: boolean,
      pomodoros: number,
      timeSpent: number,
      createdAt: Date,
      updatedAt: Date
    ) {
        this.id = id;
        this.description = description;
        this.completed = completed;
        this.pomodoros = pomodoros;
        this.timeSpent = timeSpent;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
