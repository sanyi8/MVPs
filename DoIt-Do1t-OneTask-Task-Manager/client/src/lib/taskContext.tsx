import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Task, CreateTaskData } from "./types";
import { apiRequest } from "./queryClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface TaskContextProps {
  activeTasks: Task[];
  completedTasks: Task[];
  isLoading: boolean;
  isError: boolean;
  currentTask: Task | null;
  addTask: (data: CreateTaskData) => Promise<Task>;
  completeTask: (taskId: number) => Promise<void>;
  laterTask: (taskId: number) => Promise<void>;
  reorderTasks: (taskIds: number[]) => Promise<void>;
  clearCompletedTasks: () => Promise<void>;
  clearAllTasks: () => Promise<void>;
  refetchTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["/api/tasks"],
    refetchInterval: false,
    refetchOnWindowFocus: true,
  });

  // TypeScript type assertion for data structure
  interface TaskData {
    activeTasks: Task[];
    completedTasks: Task[];
  }
  
  const taskData = (data || { activeTasks: [], completedTasks: [] }) as TaskData;
  const activeTasks: Task[] = taskData.activeTasks;
  const completedTasks: Task[] = taskData.completedTasks;

  // Set the current task to be the first active task
  useEffect(() => {
    if (activeTasks.length > 0 && (!currentTask || !activeTasks.some(t => t.id === currentTask.id))) {
      setCurrentTask(activeTasks[0]);
    } else if (activeTasks.length === 0) {
      setCurrentTask(null);
    }
  }, [activeTasks, currentTask]);

  const addTask = async (data: CreateTaskData): Promise<Task> => {
    const res = await apiRequest("POST", "/api/tasks", data);
    const newTask = await res.json();
    await queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    return newTask;
  };

  const completeTask = async (taskId: number): Promise<void> => {
    await apiRequest("POST", `/api/tasks/${taskId}/complete`);
    await queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    
    // If the completed task was the current task, update the current task
    if (currentTask && currentTask.id === taskId) {
      const remainingTasks = activeTasks.filter(t => t.id !== taskId);
      if (remainingTasks.length > 0) {
        setCurrentTask(remainingTasks[0]);
      } else {
        setCurrentTask(null);
      }
    }
  };

  const reorderTasks = async (taskIds: number[]): Promise<void> => {
    await apiRequest("POST", "/api/tasks/reorder", { taskIds });
    await queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  const clearCompletedTasks = async (): Promise<void> => {
    await apiRequest("POST", "/api/tasks/clear-completed");
    await queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
  };

  const clearAllTasks = async (): Promise<void> => {
    await apiRequest("POST", "/api/tasks/clear-all");
    await queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    setCurrentTask(null);
  };

  // Move a task to the end of the queue (Later)
  const laterTask = async (taskId: number): Promise<void> => {
    // Get all active task IDs excluding the current one
    const otherTaskIds = activeTasks.filter(t => t.id !== taskId).map(t => t.id);
    
    // Add the current task ID at the end
    const newOrder = [...otherTaskIds, taskId];
    
    // Reorder tasks 
    await reorderTasks(newOrder);
    
    // Update the current task to be the first one in the new order
    if (currentTask && currentTask.id === taskId && otherTaskIds.length > 0) {
      const nextTask = activeTasks.find(t => t.id === otherTaskIds[0]) || null;
      setCurrentTask(nextTask);
    }
  };
  
  // Manual refetch for UI refreshes
  const refetchTasks = async (): Promise<void> => {
    await refetch();
  };

  return (
    <TaskContext.Provider
      value={{
        activeTasks,
        completedTasks,
        isLoading,
        isError,
        currentTask,
        addTask,
        completeTask,
        laterTask,
        reorderTasks,
        clearCompletedTasks,
        clearAllTasks,
        refetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
