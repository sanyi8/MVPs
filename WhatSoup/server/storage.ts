import { users, type User, type InsertUser, type Recipe, type InsertRecipe, recipes } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Recipe operations
  getRecipe(id: number): Promise<Recipe | undefined>;
  getRecipesByUserId(userId: number): Promise<Recipe[]>;
  getAllRecipes(): Promise<Recipe[]>;
  getFavoriteRecipes(): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  toggleFavorite(id: number): Promise<Recipe | undefined>;
  toggleSaved(id: number): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipes: Map<number, Recipe>;
  private userIdCounter: number;
  private recipeIdCounter: number;

  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.userIdCounter = 1;
    this.recipeIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Recipe operations
  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipesByUserId(userId: number): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(
      (recipe) => recipe.userId === userId,
    );
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getFavoriteRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values()).filter(
      (recipe) => recipe.favorite === true,
    );
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.recipeIdCounter++;
    // Ensure required fields are present and properly typed
    const userId = insertRecipe.userId === undefined ? null : insertRecipe.userId;
    const notes = insertRecipe.notes === undefined ? null : insertRecipe.notes;
    const source = insertRecipe.source === undefined ? null : insertRecipe.source;
    const favorite = insertRecipe.favorite === undefined ? false : insertRecipe.favorite;
    const saved = insertRecipe.saved === undefined ? false : insertRecipe.saved;

    // Create recipe with all required fields explicitly set
    const recipe: Recipe = {
      id,
      title: insertRecipe.title,
      cookTime: insertRecipe.cookTime,
      difficulty: insertRecipe.difficulty,
      ingredients: insertRecipe.ingredients,
      instructions: insertRecipe.instructions,
      notes,
      source,
      userId,
      favorite,
      saved
    };

    this.recipes.set(id, recipe);
    return recipe;
  }

  async updateRecipe(id: number, recipeUpdate: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const existingRecipe = this.recipes.get(id);

    if (!existingRecipe) {
      return undefined;
    }

    const updatedRecipe: Recipe = { ...existingRecipe, ...recipeUpdate };
    this.recipes.set(id, updatedRecipe);

    return updatedRecipe;
  }

  async toggleFavorite(id: number): Promise<Recipe | undefined> {
    const recipe = this.recipes.get(id);
    if (!recipe) {
      return undefined;
    }

    // If recipe is favorite, unfavorite and delete it
    if (recipe.favorite) {
      await this.deleteRecipe(id);
      return { ...recipe, favorite: false };
    } else {
      // Otherwise mark as favorite
      const updatedRecipe: Recipe = { 
        ...recipe, 
        favorite: true
      };

      this.recipes.set(id, updatedRecipe);
      return updatedRecipe;
    }
  }

  async toggleSaved(id: number): Promise<Recipe | undefined> {
    const recipe = await this.getRecipe(id);
    if (!recipe) {
      return undefined;
    }

    const updatedRecipe: Recipe = {
      ...recipe,
      saved: !recipe.saved
    };

    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipes.delete(id);
  }
}

// PostgreSQL database storage
export class PostgresStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Recipe operations
  async getRecipe(id: number): Promise<Recipe | undefined> {
    const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
    return result[0];
  }

  async getRecipesByUserId(userId: number): Promise<Recipe[]> {
    const result = await db.select().from(recipes).where(eq(recipes.userId, userId));
    return result;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    const result = await db.select().from(recipes);
    return result;
  }

  async getFavoriteRecipes(): Promise<Recipe[]> {
    const result = await db.select().from(recipes).where(eq(recipes.favorite, true));
    return result;
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    // Ensure required fields are properly typed before database insertion
    const recipeData = {
      ...insertRecipe,
      notes: insertRecipe.notes === undefined ? null : insertRecipe.notes,
      source: insertRecipe.source === undefined ? null : insertRecipe.source,
      userId: insertRecipe.userId === undefined ? null : insertRecipe.userId,
      favorite: insertRecipe.favorite === undefined ? false : insertRecipe.favorite,
      saved: insertRecipe.saved === undefined ? false : insertRecipe.saved
    };

    const result = await db.insert(recipes).values(recipeData).returning();
    return result[0];
  }

  async updateRecipe(id: number, recipeUpdate: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const result = await db.update(recipes)
      .set(recipeUpdate)
      .where(eq(recipes.id, id))
      .returning();

    return result[0];
  }

  async toggleFavorite(id: number): Promise<Recipe | undefined> {
    // First get the current recipe
    const recipe = await this.getRecipe(id);
    if (!recipe) {
      return undefined;
    }

    // Toggle the favorite status
    const result = await db.update(recipes)
      .set({ favorite: !recipe.favorite })
      .where(eq(recipes.id, id))
      .returning();
    return result[0];
  }

  async toggleSaved(id: number): Promise<Recipe | undefined> {
    const recipe = await this.getRecipe(id);
    if (!recipe) {
      return undefined;
    }

    const result = await db.update(recipes)
      .set({ saved: !recipe.saved })
      .where(eq(recipes.id, id))
      .returning();

    return result[0];
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const result = await db.delete(recipes).where(eq(recipes.id, id)).returning({ id: recipes.id });
    return result.length > 0;
  }

  async clearSavedRecipes(): Promise<void> {
    await db.update(recipes)
      .set({ saved: false })
      .where(eq(recipes.saved, true));
  }
}

// Export the PostgreSQL storage implementation
// Uncomment this line to use PostgreSQL storage
export const storage = new PostgresStorage();

// In-memory storage for development/testing
// Comment this line when using PostgreSQL
// export const storage = new MemStorage();