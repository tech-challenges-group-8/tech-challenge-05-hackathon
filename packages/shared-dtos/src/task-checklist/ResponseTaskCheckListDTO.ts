export class ResponseTaskCheckListDto {
    id: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: string, description: string, completed: boolean, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.description = description;
        this.completed = completed;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
