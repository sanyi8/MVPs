// Task model
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  position: number;
  createdAt: Date;
}

// For task creation
export interface CreateTaskData {
  title: string;
  description?: string;
  completed?: boolean;
  position?: number;
}
