import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Recipe schema
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  cookTime: text("cook_time").notNull(),
  difficulty: text("difficulty").notNull(),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  notes: text("notes"),
  source: text("source"),
  userId: integer("user_id").references(() => users.id),
  favorite: boolean("favorite").default(false),
});

// Recipe relations
export const recipesRelations = relations(recipes, ({ one }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
}));

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

// Recipe Generation Request schema
export const recipeGenerationRequestSchema = z.object({
  ingredients: z.string().min(1, "Ingredients are required"),
});

export type RecipeGenerationRequest = z.infer<typeof recipeGenerationRequestSchema>;
