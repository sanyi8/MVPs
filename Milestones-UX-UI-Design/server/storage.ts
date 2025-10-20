import { timelineItems, users, type TimelineItem, type InsertTimelineItem, type User, type InsertUser } from "../shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getTimelineItems(): Promise<TimelineItem[]>;
  getTimelineItem(id: number): Promise<TimelineItem | undefined>;
  createTimelineItem(item: InsertTimelineItem): Promise<TimelineItem>;
  updateTimelineItem(id: number, item: Partial<InsertTimelineItem>): Promise<TimelineItem | undefined>;
  deleteTimelineItem(id: number): Promise<boolean>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getTimelineItems(): Promise<TimelineItem[]> {
    return await db.select()
      .from(timelineItems)
      .where(eq(timelineItems.isActive, true))
      .orderBy(timelineItems.sortOrder);
  }

  async getTimelineItem(id: number): Promise<TimelineItem | undefined> {
    const [item] = await db.select()
      .from(timelineItems)
      .where(eq(timelineItems.id, id));
    return item || undefined;
  }

  async createTimelineItem(item: InsertTimelineItem): Promise<TimelineItem> {
    const [newItem] = await db
      .insert(timelineItems)
      .values({
        ...item,
        updatedAt: new Date()
      })
      .returning();
    return newItem;
  }

  async updateTimelineItem(id: number, item: Partial<InsertTimelineItem>): Promise<TimelineItem | undefined> {
    const [updatedItem] = await db
      .update(timelineItems)
      .set({
        ...item,
        updatedAt: new Date()
      })
      .where(eq(timelineItems.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async deleteTimelineItem(id: number): Promise<boolean> {
    // Soft delete by setting isActive to false
    const [deletedItem] = await db
      .update(timelineItems)
      .set({
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(timelineItems.id, id))
      .returning();
    return !!deletedItem;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        updatedAt: new Date()
      })
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();