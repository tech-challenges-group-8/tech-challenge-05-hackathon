export interface TaskCheckList {
  id: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskCheckListDTO {
  description: string;
}

export interface UpdateTaskCheckListDTO {
  description?: string;
  isDone?: boolean;
}

export interface ResponseTaskCheckListDto {
  id: string;
  description: string;
  isDone: boolean;
  createdAt: string;
}
