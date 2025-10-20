import OpenAI from "openai";
import { Recipe } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "sample" 
});

// Define the recipe generation prompt
const generateRecipePrompt = (ingredients: string) => {
  return `
Generate EXACTLY 4 unique and creative SOUP recipes using some or all of these ingredients: ${ingredients}.

IMPORTANT: ALL recipes MUST be soups, stews, or broths - no other types of dishes.

For each soup recipe, include:
1. A creative and appetizing soup title
2. Estimated cook time (e.g., "30 minutes", "45 minutes", "1 hour")
3. Difficulty level (e.g., "Easy", "Medium", "Hard")
4. A complete list of all ingredients with measurements
5. Detailed step-by-step cooking instructions
6. Optional chef's notes or serving suggestions
7. Optional source link (if the recipe is adapted from an existing source)

The response must be a JSON object with a "recipes" property containing an array of soup recipe objects:
{
  "recipes": [
    {
      "title": "Soup Recipe Title",
      "cookTime": "Estimated Time",
      "difficulty": "Difficulty Level",
      "ingredients": ["Ingredient 1", "Ingredient 2", ...],
      "instructions": ["Step 1", "Step 2", ...],
      "notes": "Optional notes about the soup",
      "source": "Optional source link"
    },
    {
      "title": "Second Soup Recipe Title",
      "cookTime": "Estimated Time",
      "difficulty": "Difficulty Level",
      "ingredients": ["Ingredient 1", "Ingredient 2", ...],
      "instructions": ["Step 1", "Step 2", ...],
      "notes": "Optional notes about the soup",
      "source": "Optional source link"
    }
  ]
}

Make sure each soup recipe is practical, delicious, comforting, and clearly explained.
`;
};

/**
 * Generate soup recipes based on provided ingredients
 * @param ingredients - Comma-separated list of ingredients
 * @returns Array of soup recipe objects
 */
export async function generateRecipes(ingredients: string): Promise<Recipe[]> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional soup chef specialized in creating delicious soup, stew, and broth recipes from available ingredients. You only create soup-related recipes, no other types of dishes. Be creative but practical."
        },
        {
          role: "user",
          content: generateRecipePrompt(ingredients)
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    const parsedResponse = JSON.parse(content);
    
    // Check if the response has the expected format
    if (!parsedResponse.recipes && !Array.isArray(parsedResponse.recipes) && !Array.isArray(parsedResponse)) {
      throw new Error("Expected soup recipes in response");
    }

    // Return recipes array, handling different possible response formats
    if (Array.isArray(parsedResponse)) {
      return parsedResponse;
    } else if (parsedResponse.recipes && Array.isArray(parsedResponse.recipes)) {
      return parsedResponse.recipes;
    } else {
      // If we can't find recipes, try to extract them from any property that's an array
      for (const key in parsedResponse) {
        if (Array.isArray(parsedResponse[key]) && parsedResponse[key].length > 0) {
          return parsedResponse[key];
        }
      }
      throw new Error("Could not find soup recipes array in response");
    }
  } catch (err: unknown) {
    console.error("Error calling OpenAI API for soup recipes:", err);
    
    let errorMessage = 'Unknown error occurred';
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'string') {
      errorMessage = err;
    } else if (err && typeof err === 'object' && 'message' in err) {
      errorMessage = String(err.message);
    }
    
    throw new Error(`Failed to generate soup recipes: ${errorMessage}`);
  }
}
