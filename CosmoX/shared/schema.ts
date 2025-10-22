import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  name: text("name"),
  birthDate: text("birth_date").notNull(),
  birthTime: text("birth_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles).pick({
  name: true,
  birthDate: true,
  birthTime: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

// Zodiac system types
export interface ZodiacSign {
  sign: string;
  symbol: string;
  element: string;
  traits: string[];
  strengths: string[];
  growthAreas: string[];
  description: string;
  detailedDescription?: string;
}

export interface ChineseZodiac {
  animal: string;
  element: string;
  year: number;
  traits: string[];
  characteristics: { positive: string[]; challenges: string[] };
  description: string;
  elementDescription: string;
}

export interface VedicSign {
  nakshatra: string;
  number: number;
  meaning: string;
  ruler: string;
  moonSign: string;
  spiritualTraits: string[];
  description: string;
  planetaryInfluences: { planet: string; influence: string }[];
}

export interface MayanSign {
  daySign: string;
  number: number;
  meaning: string;
  spiritualQualities: string[];
  description: string;
  sacredGifts: { gift: string; description: string }[];
}

export interface CelticSign {
  tree: string;
  dateRange: string;
  meaning: string;
  lunarConnection: string;
  gifts: string[];
  description: string;
  celticWisdom: string;
}

export interface EgyptianSign {
  deity: string;
  dateRange: string;
  symbol: string;
  powers: string[];
  description: string;
  sacredAttributes: string[];
  divineGuidance: string;
}

export interface ArabicSign {
  mansion: string;
  number: number;
  arabicName: string;
  zodiacRange: string;
  keyStar: string;
  meaning: string;
  spiritualQualities: string[];
  description: string;
  magicalUses: { use: string; description: string }[];
}

export interface ZodiacProfile {
  western: ZodiacSign;
  chinese: ChineseZodiac;
  vedic: VedicSign;
  mayan: MayanSign;
  celtic: CelticSign;
  arabic: ArabicSign;
  unifiedThemes: string[];
  integrationOpportunities: string[];
}
