
export class Task {
    id: string;
    idUser: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        idUser: string,
        description: string,
        completed: boolean = false,
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

    private validateDescription(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new Error('Task title cannot be empty');
        }
    }

    private touch(): void {
        this.updatedAt = new Date();
    }
}