import { 
  users, type User, type InsertUser,
  sessions, type Session, type InsertSession,
  drinks, type Drink, type InsertDrink,
  type FrontendDrink
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Database connection setup
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString!);
const db = drizzle(client);

// Storage interface with all CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  updateSessionPoints(id: string, totalPoints: number, hasMixedDrinks: boolean): Promise<Session | undefined>;
  getUserSessions(userId: number): Promise<Session[]>;
  
  // Drink methods
  addDrink(drink: InsertDrink): Promise<Drink>;
  getSessionDrinks(sessionId: string): Promise<Drink[]>;
  removeDrink(id: number): Promise<boolean>;
}

// PostgreSQL database implementation
export class DbStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  // Session methods
  async createSession(session: InsertSession): Promise<Session> {
    const result = await db.insert(sessions).values(session).returning();
    return result[0];
  }
  
  async getSession(id: string): Promise<Session | undefined> {
    const result = await db.select().from(sessions).where(eq(sessions.id, id));
    return result[0];
  }
  
  async updateSessionPoints(id: string, totalPoints: number, hasMixedDrinks: boolean): Promise<Session | undefined> {
    const result = await db
      .update(sessions)
      .set({ totalPoints, hasMixedDrinks })
      .where(eq(sessions.id, id))
      .returning();
    return result[0];
  }
  
  async getUserSessions(userId: number): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(sessions.createdAt);
  }
  
  // Drink methods
  async addDrink(drink: InsertDrink): Promise<Drink> {
    const result = await db.insert(drinks).values(drink).returning();
    return result[0];
  }
  
  async getSessionDrinks(sessionId: string): Promise<Drink[]> {
    return await db
      .select()
      .from(drinks)
      .where(eq(drinks.sessionId, sessionId))
      .orderBy(drinks.createdAt);
  }
  
  async removeDrink(id: number): Promise<boolean> {
    const result = await db
      .delete(drinks)
      .where(eq(drinks.id, id))
      .returning({ id: drinks.id });
    return result.length > 0;
  }
}

// In-memory storage implementation for fallback/testing
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private sessionsMap: Map<string, Session>;
  private drinksMap: Map<number, Drink>;
  private currentUserId: number;
  private currentDrinkId: number;

  constructor() {
    this.usersMap = new Map();
    this.sessionsMap = new Map();
    this.drinksMap = new Map();
    this.currentUserId = 1;
    this.currentDrinkId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.usersMap.set(id, user);
    return user;
  }
  
  // Session methods
  async createSession(session: InsertSession): Promise<Session> {
    // Use the provided ID if available, otherwise generate one
    const id = session.id || crypto.randomUUID();
    const now = new Date();
    // Ensure all required fields have values
    const newSession: Session = { 
      ...session, 
      id, 
      createdAt: now,
      totalPoints: session.totalPoints ?? 0,
      hasMixedDrinks: session.hasMixedDrinks ?? false,
      userId: session.userId ?? null
    };
    this.sessionsMap.set(id, newSession);
    return newSession;
  }
  
  async getSession(id: string): Promise<Session | undefined> {
    return this.sessionsMap.get(id);
  }
  
  async updateSessionPoints(id: string, totalPoints: number, hasMixedDrinks: boolean): Promise<Session | undefined> {
    const session = this.sessionsMap.get(id);
    if (!session) return undefined;
    
    const updatedSession = { 
      ...session, 
      totalPoints, 
      hasMixedDrinks 
    };
    this.sessionsMap.set(id, updatedSession);
    return updatedSession;
  }
  
  async getUserSessions(userId: number): Promise<Session[]> {
    return Array.from(this.sessionsMap.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  // Drink methods
  async addDrink(drink: InsertDrink): Promise<Drink> {
    const id = this.currentDrinkId++;
    const now = new Date();
    const newDrink: Drink = { 
      ...drink, 
      id, 
      createdAt: now 
    };
    this.drinksMap.set(id, newDrink);
    return newDrink;
  }
  
  async getSessionDrinks(sessionId: string): Promise<Drink[]> {
    return Array.from(this.drinksMap.values())
      .filter(drink => drink.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  async removeDrink(id: number): Promise<boolean> {
    return this.drinksMap.delete(id);
  }
}

// Use database storage by default, with memory storage as fallback
export const storage = connectionString 
  ? new DbStorage() 
  : new MemStorage();
