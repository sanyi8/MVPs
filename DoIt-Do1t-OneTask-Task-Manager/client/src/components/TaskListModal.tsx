import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/lib/types";
import { Trash2, RefreshCw, GripVertical, Sparkles, Loader2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { prioritizeTasks } from "@/lib/aiService";
import { useToast } from "@/hooks/use-toast";

interface TaskListModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeTasks: Task[];
  completedTasks: Task[];
  onClearDone: () => void;
  onResetAll: () => void;
  onReorderTasks: (taskIds: number[]) => Promise<void>;
}

export default function TaskListModal({
  isOpen,
  onOpenChange,
  activeTasks,
  completedTasks,
  onClearDone,
  onResetAll,
  onReorderTasks,
}: TaskListModalProps) {
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const { toast } = useToast();
  
  const handleDragEnd = async (result: any) => {
    // Dropped outside the list
    if (!result.destination) return;
    
    // If position didn't change, do nothing
    if (result.destination.index === result.source.index) return;
    
    // Reorder the tasks
    const items = Array.from(activeTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Get the task IDs in the new order
    const taskIds = items.map(task => task.id);
    
    // Update the positions in the backend
    await onReorderTasks(taskIds);
  };
  
  // Use AI to prioritize tasks
  const handleAIPrioritize = async () => {
    if (activeTasks.length < 2) {
      toast({
        title: "Not enough tasks",
        description: "You need at least 2 active tasks to prioritize",
      });
      return;
    }
    
    setIsPrioritizing(true);
    try {
      const result = await prioritizeTasks(activeTasks);
      
      if (result.success) {
        // Update the tasks order in the backend
        await onReorderTasks(result.prioritizedIds);
        
        toast({
          title: "Tasks prioritized",
          description: "AI has reorganized your tasks by time and priority",
        });
      } else {
        toast({
          title: "Prioritization failed",
          description: "Could not prioritize tasks with AI",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error prioritizing tasks:", error);
      toast({
        title: "Prioritization failed",
        description: "Could not connect to AI service",
        variant: "destructive",
      });
    } finally {
      setIsPrioritizing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0 bg-background border-border">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-5 border-b border-border">
            <SheetTitle className="text-2xl font-bold text-foreground">All Tasks</SheetTitle>
          </SheetHeader>
          
          <div className="overflow-y-auto p-6 flex-1 flex justify-center">
            <div className="w-full max-w-md">
              {/* Active Tasks Section */}
              <h3 className="font-semibold text-muted-foreground uppercase text-sm tracking-wider mb-3">
                Active Tasks
              </h3>
              
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="active-tasks">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="mb-4"
                    >
                      {activeTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-card rounded-lg border border-border p-4 mb-3 flex items-center shadow-sm"
                            >
                              <div 
                                {...provided.dragHandleProps}
                                className="mr-3 text-muted-foreground cursor-move"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-base text-card-foreground">{task.title}</h4>
                                {task.description && (
                                  <p className="text-sm text-card-foreground/70 mt-1">{task.description}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {activeTasks.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground text-base">No active tasks</div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              
              {/* Done Tasks Section */}
              <h3 className="font-semibold text-muted-foreground uppercase text-sm tracking-wider mb-3 mt-6">
                Completed Tasks
              </h3>
              
              {completedTasks.map((task) => (
                <div key={task.id} className="bg-muted/50 rounded-lg border border-border p-4 mb-3">
                  <h4 className="font-medium text-base task-done text-muted-foreground">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-muted-foreground/70 task-done mt-1">{task.description}</p>
                  )}
                </div>
              ))}
              
              {completedTasks.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-base">No completed tasks</div>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-border flex items-center justify-center bg-background">
            <div className="w-full max-w-md space-y-3">
              {/* AI Prioritize Button */}
              {activeTasks.length > 1 && (
                <Button
                  onClick={handleAIPrioritize}
                  className="w-full h-12 flex items-center justify-center text-base bg-[#14b8a6] hover:bg-[#0d9488] dark:bg-accent dark:hover:bg-accent/90 text-white dark:text-accent-foreground font-semibold"
                  disabled={isPrioritizing}
                >
                  {isPrioritizing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Prioritizing tasks...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Prioritize with AI
                    </>
                  )}
                </Button>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={onClearDone} 
                  variant="outline" 
                  className="h-12 text-base bg-muted hover:bg-muted/80 text-foreground border-border font-semibold"
                  disabled={completedTasks.length === 0}
                >
                  <Trash2 className="mr-2 h-5 w-5" /> Clear Done
                </Button>
                <Button 
                  onClick={onResetAll} 
                  variant="outline" 
                  className="h-12 text-base bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive font-semibold"
                  disabled={activeTasks.length === 0 && completedTasks.length === 0}
                >
                  <RefreshCw className="mr-2 h-5 w-5" /> Reset All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
