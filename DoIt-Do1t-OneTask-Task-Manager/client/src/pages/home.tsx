import { useState, useEffect } from "react";
import { useTaskContext } from "@/lib/taskContext";
import { useTheme } from "@/lib/themeContext";
import TaskCard from "@/components/TaskCard";
import EmptyState from "@/components/EmptyState";
import TaskListModal from "@/components/TaskListModal";
import AddTaskModal from "@/components/AddTaskModal";
import AlertDialog from "@/components/AlertDialog";
import SettingsModal from "@/components/SettingsModal";
import { Button } from "@/components/ui/button";
import { ListChecks, Plus, Settings, Moon, Sun } from "lucide-react";
import { Task, CreateTaskData } from "@/lib/types";

export default function Home() {
  const {
    activeTasks,
    completedTasks,
    isLoading,
    currentTask,
    addTask,
    completeTask,
    laterTask,
    reorderTasks,
    clearCompletedTasks,
    clearAllTasks,
    refetchTasks,
  } = useTaskContext();

  const { theme, toggleTheme } = useTheme();
  const [taskListModalOpen, setTaskListModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userName, setUserName] = useState("Tom");

  // Alert dialogs
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // If there are no tasks, open the add task modal
  useEffect(() => {
    if (!isLoading && activeTasks.length === 0 && completedTasks.length === 0) {
      setAddTaskModalOpen(true);
    }
  }, [isLoading, activeTasks, completedTasks]);

  useEffect(() => {
    const savedName = localStorage.getItem("userName") || "Tom";
    setUserName(savedName);
  }, [isSettingsOpen]);

  const showAlert = (title: string, message: string, onConfirm: () => void) => {
    setAlertConfig({ title, message, onConfirm });
    setAlertOpen(true);
  };

  const handleDoneClick = (task: Task) => {
    showAlert(
      "Mark as Done",
      "Mark this task as done today?",
      async () => {
        await completeTask(task.id);
        await refetchTasks();
      }
    );
  };

  const handleLaterClick = (task: Task) => {
    showAlert(
      "Move to Later",
      "Move this task to later? It will be moved to the end of your task list.",
      async () => {
        await laterTask(task.id);
        await refetchTasks();
      }
    );
  };

  const handleAddTask = async (data: CreateTaskData) => {
    await addTask(data);
    await refetchTasks();
  };

  const handleClearDone = () => {
    if (completedTasks.length === 0) return;

    showAlert(
      "Clear Completed",
      "Are you sure you want to delete all completed tasks?",
      async () => {
        await clearCompletedTasks();
        await refetchTasks();
      }
    );
  };

  const handleResetAll = () => {
    if (activeTasks.length === 0 && completedTasks.length === 0) return;

    showAlert(
      "Reset Everything",
      "Are you sure you want to delete ALL tasks (active and completed)?",
      async () => {
        await clearAllTasks();
        await refetchTasks();
      }
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center px-4 py-6">
      <div id="app" className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-[0_20px_60px_-15px_rgba(20,184,166,0.4)]">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="leading-tight">
              <h1 className="text-2xl font-bold text-foreground">Do1t</h1>
              <p className="text-sm text-muted-foreground">Hello, {userName}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={toggleTheme} 
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-muted"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-foreground" />
              )}
            </Button>
            <Button 
              onClick={() => setIsSettingsOpen(true)} 
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-muted"
            >
              <Settings className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex items-center justify-center min-h-[300px]">
          {currentTask ? (
            <TaskCard
              task={currentTask}
              onDone={handleDoneClick}
              onLater={handleLaterClick}
            />
          ) : (
            <EmptyState onAddTask={() => setAddTaskModalOpen(true)} />
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => setTaskListModalOpen(true)} 
            variant="outline"
            className="h-12 text-base bg-muted hover:bg-muted/80 text-foreground border-border"
          >
            <ListChecks className="mr-2 h-5 w-5" /> List
          </Button>
          <Button 
            onClick={() => setAddTaskModalOpen(true)} 
            className="h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="mr-2 h-5 w-5" /> Add
          </Button>
        </div>
      </div>

      {/* Modals */}
      <TaskListModal
        isOpen={taskListModalOpen}
        onOpenChange={setTaskListModalOpen}
        activeTasks={activeTasks}
        completedTasks={completedTasks}
        onClearDone={handleClearDone}
        onResetAll={handleResetAll}
        onReorderTasks={reorderTasks}
      />

      <AddTaskModal
        isOpen={addTaskModalOpen}
        onOpenChange={setAddTaskModalOpen}
        onAdd={handleAddTask}
      />

      <AlertDialog
        isOpen={alertOpen}
        onOpenChange={setAlertOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
}