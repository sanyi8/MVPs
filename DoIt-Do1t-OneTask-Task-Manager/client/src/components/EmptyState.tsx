import { Button } from "@/components/ui/button";
import { CheckCircle, Plus } from "lucide-react";

interface EmptyStateProps {
  onAddTask: () => void;
}

export default function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <div className="w-full text-center py-12">
      <div className="text-muted-foreground mb-6">
        <CheckCircle className="h-20 w-20 mx-auto" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">No tasks to show</h3>
      <p className="text-muted-foreground text-base mb-8">Add your first task to get started</p>
      <Button 
        onClick={onAddTask} 
        className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      >
        <Plus className="mr-2 h-5 w-5" /> Add Task
      </Button>
    </div>
  );
}
