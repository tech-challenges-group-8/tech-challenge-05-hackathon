import { TaskKanbanPriority } from "./enums/TaskKanbanPriorityEnum";
import { TaskKanbanStatus } from "./enums/TaskKanbanStatusEnum";


export class TaskKanban {
    id: string;
    idUser: string;
    title: string;
    description?: string;
    status: TaskKanbanStatus;
    priority: TaskKanbanPriority;
    dueDate?: Date;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    tags?: string[];

    constructor(
        id: string,
        idUser: string,
        title: string,
        status: TaskKanbanStatus = TaskKanbanStatus.Todo,
        priority: TaskKanbanPriority = TaskKanbanPriority.Low,
        createdAt: Date = new Date()
    ) {
        this.validateTitle(title);

        if (!idUser || idUser.trim().length === 0) {
            throw new Error('idUser is required');
        }

        this.id = id;
        this.idUser = idUser;
        this.title = title;
        this.status = status;
        this.priority = priority;

        this.completed = false;
        this.createdAt = createdAt;
        this.updatedAt = createdAt;
    }

    updateTitle(newTitle: string): void {
        this.validateTitle(newTitle);
        this.title = newTitle;
        this.touch();
    }

    updateDescription(description?: string): void {
        this.description = description;
        this.touch();
    }

    changeStatus(status: TaskKanbanStatus): void {
        this.status = status;
        this.completed = status === TaskKanbanStatus.Done;
        this.touch();
    }

    changePriority(priority: TaskKanbanPriority): void {
        this.priority = priority;
        this.touch();
    }

    setDueDate(dueDate?: Date): void {
        this.dueDate = dueDate;
        this.touch();
    }

    addTag(tag: string): void {
        if (!tag.trim()) return;

        if (!this.tags) {
            this.tags = [];
        }

        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            this.touch();
        }
    }

    removeTag(tag: string): void {
        if (!this.tags) return;

        this.tags = this.tags.filter(t => t !== tag);
        this.touch();
    }

    setTags(tags: string[]): void {
        this.tags = tags;
        this.touch();
    }

    private validateTitle(title: string): void {
        if (!title || title.trim().length === 0) {
            throw new Error('Task title cannot be empty');
        }
    }

    private touch(): void {
        this.updatedAt = new Date();
    }
}

export interface KanbanColumn {
    id: TaskKanbanStatus;
    title: string;
    tasks: TaskKanban[];
}