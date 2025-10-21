import { tasks, type Task, type InsertTask, users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, and, asc, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task methods
  getTasks(): Promise<Task[]>;
  getActiveTasks(): Promise<Task[]>;
  getCompletedTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  updateTaskPositions(taskIds: number[]): Promise<boolean>;
  markTaskComplete(id: number): Promise<Task | undefined>;
  clearCompletedTasks(): Promise<boolean>;
  clearAllTasks(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks).orderBy(asc(tasks.position));
  }

  async getActiveTasks(): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.completed, false))
      .orderBy(asc(tasks.position));
  }

  async getCompletedTasks(): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.completed, true))
      .orderBy(asc(tasks.position));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    // Calculate the highest position value
    const [{ maxPosition }] = await db
      .select({ 
        maxPosition: sql<number>`COALESCE(MAX(${tasks.position}), 0)` 
      })
      .from(tasks)
      .where(eq(tasks.completed, false));
    
    // Create new task with the next position
    const [task] = await db
      .insert(tasks)
      .values({
        ...insertTask,
        position: maxPosition + 1
      })
      .returning();
      
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
      
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return !!result;
  }

  async updateTaskPositions(taskIds: number[]): Promise<boolean> {
    try {
      // Begin a transaction to ensure all updates succeed or fail together
      await db.transaction(async (tx) => {
        // Update each task's position based on the order in taskIds
        for (let i = 0; i < taskIds.length; i++) {
          await tx
            .update(tasks)
            .set({ position: i + 1 })
            .where(eq(tasks.id, taskIds[i]));
        }
      });
      
      return true;
    } catch (error) {
      console.error("Error updating task positions:", error);
      return false;
    }
  }

  async markTaskComplete(id: number): Promise<Task | undefined> {
    // Mark task as complete
    const [completedTask] = await db
      .update(tasks)
      .set({ completed: true })
      .where(eq(tasks.id, id))
      .returning();
    
    if (!completedTask) return undefined;
    
    // Get all remaining active tasks to reorder them
    const activeTasks = await this.getActiveTasks();
    const activeTaskIds = activeTasks.map(task => task.id);
    
    // Reorder the remaining active tasks
    if (activeTaskIds.length > 0) {
      await this.updateTaskPositions(activeTaskIds);
    }
    
    return completedTask;
  }

  async clearCompletedTasks(): Promise<boolean> {
    try {
      await db.delete(tasks).where(eq(tasks.completed, true));
      return true;
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
      return false;
    }
  }

  async clearAllTasks(): Promise<boolean> {
    try {
      await db.delete(tasks);
      return true;
    } catch (error) {
      console.error("Error clearing all tasks:", error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();
