import { useState, useEffect, useRef } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CreateTaskData } from "@/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sparkles, CheckIcon, Loader2 } from "lucide-react";
import { getSuggestion, getDescription, organizeTask } from "@/lib/aiService";
import { useToast } from "@/hooks/use-toast";

interface AddTaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: CreateTaskData) => Promise<void>;
}

const formSchema = z.object({
  title: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddTaskModal({
  isOpen,
  onOpenChange,
  onAdd,
}: AddTaskModalProps) {
  const { toast } = useToast();
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [isSuggestingDescription, setIsSuggestingDescription] = useState(false);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const suggestTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  
  // Get form values for easier access
  const titleValue = form.watch("title");
  const descriptionValue = form.watch("description");

  // AI suggestion for title as user types
  useEffect(() => {
    if (suggestTimeoutRef.current) {
      clearTimeout(suggestTimeoutRef.current);
    }
    
    // Only suggest if title has some content but isn't too long
    if (titleValue && titleValue.length > 3 && !descriptionValue && !isSuggestingDescription) {
      suggestTimeoutRef.current = setTimeout(async () => {
        setIsSuggestingDescription(true);
        try {
          const suggestion = await getDescription(titleValue);
          if (suggestion && !form.getValues("description")) {
            form.setValue("description", suggestion);
          }
        } catch (error) {
          console.error("Error getting AI description suggestion:", error);
        } finally {
          setIsSuggestingDescription(false);
        }
      }, 1000); // 1 second delay after user stops typing
    }
    
    return () => {
      if (suggestTimeoutRef.current) {
        clearTimeout(suggestTimeoutRef.current);
      }
    };
  }, [titleValue, form, descriptionValue, isSuggestingDescription]);

  // Handle AI organization of task
  const handleOrganize = async () => {
    if (!titleValue) return;
    
    setIsOrganizing(true);
    try {
      const organized = await organizeTask(titleValue, descriptionValue || "");
      
      if (organized.title) {
        form.setValue("title", organized.title);
      }
      
      if (organized.description) {
        form.setValue("description", organized.description);
      }
      
      toast({
        title: "Task cleaned up",
        description: "AI organized your task into clear, simple format",
      });
    } catch (error) {
      console.error("Error organizing task:", error);
      toast({
        title: "Organization failed",
        description: "Could not organize task with AI",
        variant: "destructive",
      });
    } finally {
      setIsOrganizing(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    await onAdd({
      title: data.title,
      description: data.description,
      position: 0, // This will be adjusted by the backend to position at the end
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0 bg-background border-border">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-5 border-b border-border">
            <SheetTitle className="text-2xl font-bold text-foreground">Add New Task</SheetTitle>
          </SheetHeader>
          
          <div className="p-6 flex items-center justify-center">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-foreground">Task Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What needs to be done?" 
                          className="w-full h-12 text-base bg-card text-card-foreground border-border"
                          autoFocus
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-base font-semibold text-foreground">
                          Description (optional)
                        </FormLabel>
                        {isSuggestingDescription && (
                          <div className="text-sm text-primary flex items-center">
                            <Loader2 className="animate-spin mr-1 h-4 w-4" />
                            AI suggesting...
                          </div>
                        )}
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Add some details..."
                          className="w-full text-base bg-card text-card-foreground border-border min-h-[100px]"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="button"
                  onClick={handleOrganize}
                  className="w-full h-12 flex items-center justify-center text-base bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  disabled={!titleValue || isOrganizing}
                >
                  {isOrganizing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Cleaning up...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Clean Up & Organize
                    </>
                  )}
                </Button>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="h-12 text-base bg-muted hover:bg-muted/80 text-foreground border-border font-semibold"
                    onClick={() => {
                      form.reset();
                      onOpenChange(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                  >
                    Add Task
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
