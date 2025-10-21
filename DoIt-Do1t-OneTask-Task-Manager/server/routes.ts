import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";
import { 
  generateTaskSuggestion, 
  generateTaskDescription, 
  organizeTask,
  prioritizeTasks
} from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET all tasks
  app.get("/api/tasks", async (req: Request, res: Response) => {
    try {
      const [activeTasks, completedTasks] = await Promise.all([
        storage.getActiveTasks(),
        storage.getCompletedTasks()
      ]);
      
      res.json({ activeTasks, completedTasks });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // GET active tasks
  app.get("/api/tasks/active", async (req: Request, res: Response) => {
    try {
      const tasks = await storage.getActiveTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active tasks" });
    }
  });

  // GET completed tasks
  app.get("/api/tasks/completed", async (req: Request, res: Response) => {
    try {
      const tasks = await storage.getCompletedTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completed tasks" });
    }
  });

  // GET single task
  app.get("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // POST create new task
  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid task data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create task" });
      }
    }
  });

  // PATCH update task
  app.patch("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const task = await storage.updateTask(id, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // DELETE task
  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // POST mark task as complete
  app.post("/api/tasks/:id/complete", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const task = await storage.markTaskComplete(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark task as complete" });
    }
  });

  // POST reorder tasks
  app.post("/api/tasks/reorder", async (req: Request, res: Response) => {
    try {
      const { taskIds } = req.body;
      
      if (!Array.isArray(taskIds)) {
        return res.status(400).json({ message: "Invalid taskIds array" });
      }
      
      const updated = await storage.updateTaskPositions(taskIds);
      if (!updated) {
        return res.status(500).json({ message: "Failed to update task positions" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to reorder tasks" });
    }
  });

  // POST clear completed tasks
  app.post("/api/tasks/clear-completed", async (req: Request, res: Response) => {
    try {
      const cleared = await storage.clearCompletedTasks();
      if (!cleared) {
        return res.status(500).json({ message: "Failed to clear completed tasks" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear completed tasks" });
    }
  });

  // POST clear all tasks
  app.post("/api/tasks/clear-all", async (req: Request, res: Response) => {
    try {
      const cleared = await storage.clearAllTasks();
      if (!cleared) {
        return res.status(500).json({ message: "Failed to clear all tasks" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear all tasks" });
    }
  });

  // AI ENDPOINTS

  // POST generate task suggestion based on user input
  app.post("/api/ai/suggest", async (req: Request, res: Response) => {
    try {
      const { userInput } = req.body;
      
      if (!userInput || typeof userInput !== 'string') {
        return res.status(400).json({ message: "Invalid input" });
      }
      
      const suggestion = await generateTaskSuggestion(userInput);
      res.json({ suggestion });
    } catch (error) {
      console.error("Error in suggestion endpoint:", error);
      res.status(500).json({ message: "Failed to generate suggestion" });
    }
  });

  // POST generate task description based on title
  app.post("/api/ai/describe", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: "Invalid title" });
      }
      
      const description = await generateTaskDescription(title);
      res.json({ description });
    } catch (error) {
      console.error("Error in description endpoint:", error);
      res.status(500).json({ message: "Failed to generate description" });
    }
  });

  // POST organize task (improve title and description)
  app.post("/api/ai/organize", async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: "Invalid title" });
      }
      
      const organized = await organizeTask(title, description || "");
      res.json(organized);
    } catch (error) {
      console.error("Error in organize endpoint:", error);
      res.status(500).json({ message: "Failed to organize task" });
    }
  });

  // POST prioritize tasks
  app.post("/api/ai/prioritize", async (req: Request, res: Response) => {
    try {
      const { tasks } = req.body;
      
      if (!Array.isArray(tasks)) {
        return res.status(400).json({ message: "Invalid tasks array" });
      }
      
      const prioritizedIds = await prioritizeTasks(tasks);
      
      // Update the task positions based on the prioritized order
      await storage.updateTaskPositions(prioritizedIds);
      
      // Get the updated active tasks
      const activeTasks = await storage.getActiveTasks();
      
      res.json({ success: true, prioritizedIds, activeTasks });
    } catch (error) {
      console.error("Error in prioritize endpoint:", error);
      res.status(500).json({ message: "Failed to prioritize tasks" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
