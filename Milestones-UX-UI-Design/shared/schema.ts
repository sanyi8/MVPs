import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const timelineItems = pgTable('timeline_items', {
  id: serial('id').primaryKey(),
  year: text('year').notNull(),
  title: text('title').notNull(),
  organization: text('organization'),
  description: text('description').notNull(),
  skills: text('skills'), // JSON string of skills array
  isActive: boolean('is_active').default(true),
  sortOrder: serial('sort_order'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const timelineItemsRelations = relations(timelineItems, ({ one }) => ({
  user: one(users, {
    fields: [timelineItems.id],
    references: [users.id]
  })
}));

export const usersRelations = relations(users, ({ many }) => ({
  timelineItems: many(timelineItems)
}));

export type TimelineItem = typeof timelineItems.$inferSelect;
export type InsertTimelineItem = typeof timelineItems.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;