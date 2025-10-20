export type DrinkType = 'beer' | 'wine' | 'spirits' | 'water' | 'custom';

export interface Drink {
  id?: number;      // ID from the database
  type: DrinkType;
  amount: number;
  points: number;
  sessionId?: string; // Session ID reference
  customName?: string; // Name for custom drinks
  customEmoji?: string; // Emoji for custom drinks
  customPercentage?: number; // Alcohol % for custom drinks
}

export interface TipsyLevel {
  text: string;
  barColor: string;
  message: string;
}
