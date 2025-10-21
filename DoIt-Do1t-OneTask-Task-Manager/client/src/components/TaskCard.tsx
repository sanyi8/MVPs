import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ClockIcon } from "lucide-react";
import { Task } from "@/lib/types";

// Assuming Check and Clock are imported from lucide-react as CheckCircle and ClockIcon respectively
// For the purpose of this fix, we'll use the existing CheckCircle and ClockIcon and adapt them conceptually.
// If the intention was to specifically use `Check` and `Clock`, then those imports would need to be added.

interface TaskCardProps {
  task: Task;
  onDone: (task: Task) => void;
  onLater: (task: Task) => void;
}

export default function TaskCard({ task, onDone, onLater }: TaskCardProps) {
  return (
    <Card id="screener" className="w-full bg-card border-0 p-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-3">{task.title}</h2>
      {task.description && (
        <p className="text-card-foreground/80 mb-6 text-base">{task.description}</p>
      )}

      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => onDone(task)}
          variant="default"
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          Done
        </Button>
        <Button
          onClick={() => onLater(task)}
          variant="outline"
          className="flex-1 bg-muted hover:bg-muted/80 text-foreground border-border h-12 text-base font-semibold"
        >
          <ClockIcon className="mr-2 h-5 w-5" />
          Later
        </Button>
      </div>
    </Card>
  );
}