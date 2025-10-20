import { pgTable, text, serial, integer, boolean, timestamp, real, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the drink type enum
export const drinkTypeEnum = pgEnum('drink_type', ['beer', 'wine', 'spirits', 'water']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sessions table to track each calculation session
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id").references(() => users.id),
  totalPoints: real("total_points").notNull().default(0),
  hasMixedDrinks: boolean("has_mixed_drinks").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Drinks table to track individual drinks within a session
export const drinks = pgTable("drinks", {
  id: serial("id").primaryKey(),
  sessionId: uuid("session_id").notNull().references(() => sessions.id),
  type: drinkTypeEnum("type").notNull(),
  amount: real("amount").notNull(), // in deciliters
  points: integer("points").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas for each table
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(sessions)
  .pick({
    id: true,
    userId: true, 
    totalPoints: true,
    hasMixedDrinks: true,
  })
  .partial({ userId: true }); // Make userId optional for development

export const insertDrinkSchema = createInsertSchema(drinks).pick({
  sessionId: true,
  type: true,
  amount: true,
  points: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;

export type InsertDrink = z.infer<typeof insertDrinkSchema>;
export type Drink = typeof drinks.$inferSelect;

// Frontend drink type alias to avoid conflicts
export type FrontendDrink = {
  type: 'beer' | 'wine' | 'spirits' | 'water';
  amount: number;
  points: number;
};
