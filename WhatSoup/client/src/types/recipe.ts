export interface Recipe {
  id?: number;
  title: string;
  cookTime: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  notes?: string;
  source?: string;
  userId?: number | null;
  favorite?: boolean;
}
