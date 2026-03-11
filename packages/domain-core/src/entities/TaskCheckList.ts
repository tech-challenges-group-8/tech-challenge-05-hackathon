
export class TaskCheckList {
    id: string;
    idUser: string;
    description: string;
    completed: boolean;
    pomodoros: number;
    timeSpent: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        idUser: string,
        description: string,
        completed: boolean = false,
        pomodoros: number = 0,
        timeSpent: number = 0,
        createdAt: Date = new Date()
    ) {
        this.validateDescription(description);
        
        if (!idUser || idUser.trim().length === 0) {
            throw new Error('idUser is required');
        }

        this.id = id;
        this.idUser = idUser;
        this.description = description;
        this.completed = completed;
        this.pomodoros = pomodoros;
        this.timeSpent = timeSpent;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    completeTask(): void {
        this.completed = true;
        this.touch();
    }

    revertTask(): void {
        this.completed = false;
        this.touch();
    }

    updateDescription(description: string): void {
        this.validateDescription(description);
        this.description = description;
        this.touch();
    }

    setDone(isDone: boolean): void {
        this.completed = isDone;
        this.touch();
    }

    private validateDescription(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new Error('Task title cannot be empty');
        }
    }

    private touch(): void {
        this.updatedAt = new Date();
    }
}