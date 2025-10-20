import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateRecipes } from "./openai";
import { recipeGenerationRequestSchema, insertRecipeSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to generate recipes based on ingredients
  app.post("/api/recipes", async (req, res) => {
    try {
      // Validate request body
      const validationResult = recipeGenerationRequestSchema.safeParse(req.body);

      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: validationError.message 
        });
      }

      const { ingredients } = validationResult.data;

      // Generate recipes using OpenAI
      const generatedRecipes = await generateRecipes(ingredients);

      // Don't store recipes in the database immediately
      // Only return the generated recipes to the client
      // They will be saved only when favorited with the star icon

      return res.status(200).json(generatedRecipes);
    } catch (error) {
      console.error("Error generating soup recipes:", error);
      return res.status(500).json({ 
        message: "Failed to generate soup recipes. Please try again." 
      });
    }
  });

  // API route to get all recipes
  app.get("/api/recipes", async (_req, res) => {
    try {
      // Get all recipes (this is a simplified implementation - in a real app, 
      // you might want to add pagination, filtering, etc.)
      const recipes = await storage.getAllRecipes();
      return res.status(200).json(recipes);
    } catch (error) {
      console.error("Error fetching soup recipes:", error);
      return res.status(500).json({
        message: "Failed to fetch soup recipes. Please try again."
      });
    }
  });

  // API route to get favorite recipes
  app.get("/api/recipes/favorites", async (_req, res) => {
    try {
      const recipes = await storage.getFavoriteRecipes();
      return res.status(200).json(recipes);
    } catch (error) {
      console.error("Error fetching favorite soup recipes:", error);
      return res.status(500).json({
        message: "Failed to fetch favorite soup recipes. Please try again."
      });
    }
  });

  // API route to get a specific recipe by ID
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid soup recipe ID" });
      }

      const recipe = await storage.getRecipe(id);
      if (!recipe) {
        return res.status(404).json({ message: "Soup recipe not found" });
      }

      return res.status(200).json(recipe);
    } catch (error) {
      console.error("Error fetching soup recipe:", error);
      return res.status(500).json({
        message: "Failed to fetch the soup recipe. Please try again."
      });
    }
  });

  // API route to toggle a recipe's saved status
  app.patch("/api/recipes/:id/save", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }

      // If id is 0, this is a new recipe to save
      if (id === 0 && req.body) {
        try {
          const newRecipe = { ...req.body, saved: true };
          const validRecipe = insertRecipeSchema.parse(newRecipe);
          const savedRecipe = await storage.createRecipe(validRecipe);
          return res.status(201).json(savedRecipe);
        } catch (error) {
          console.error("Error saving new recipe:", error);
          return res.status(400).json({ message: "Invalid recipe format" });
        }
      }

      // For existing recipe, toggle saved status
      const recipe = await storage.toggleSaved(id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      return res.status(200).json(recipe);
    } catch (error) {
      console.error("Error toggling saved status for recipe:", error);
      return res.status(500).json({
        message: "Failed to update the recipe saved status. Please try again."
      });
    }
  });

  // API route to toggle a recipe's favorite status
  // Support both PUT and PATCH for backward compatibility
  app.put("/api/recipes/:id/favorite", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid soup recipe ID" });
      }

      // If id is 0, this is a new recipe to save from client
      if (id === 0 && req.body) {
        // Create new recipe directly with favorite=true
        try {
          const newRecipe = { ...req.body, favorite: true };
          const validRecipe = insertRecipeSchema.parse(newRecipe);
          const savedRecipe = await storage.createRecipe(validRecipe);
          return res.status(201).json(savedRecipe);
        } catch (error) {
          console.error("Error saving new recipe:", error);
          return res.status(400).json({ 
            message: "Invalid recipe format" 
          });
        }
      }

      // For existing recipe, toggle favorite
      const recipe = await storage.toggleFavorite(id);
      if (!recipe) {
        return res.status(404).json({ message: "Soup recipe not found" });
      }

      return res.status(200).json(recipe);
    } catch (error) {
      console.error("Error toggling favorite status for soup recipe:", error);
      return res.status(500).json({
        message: "Failed to update the soup recipe favorite status. Please try again."
      });
    }
  });

  // Also support PATCH for the same functionality
  app.patch("/api/recipes/:id/favorite", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid soup recipe ID" });
      }

      // If id is 0, this is a new recipe to save from client
      if (id === 0 && req.body) {
        // Create new recipe directly with favorite=true
        try {
          const newRecipe = { ...req.body, favorite: true };
          const validRecipe = insertRecipeSchema.parse(newRecipe);
          const savedRecipe = await storage.createRecipe(validRecipe);
          return res.status(201).json(savedRecipe);
        } catch (error) {
          console.error("Error saving new recipe:", error);
          return res.status(400).json({ 
            message: "Invalid recipe format" 
          });
        }
      }

      // For existing recipe, toggle favorite
      const recipe = await storage.toggleFavorite(id);
      if (!recipe) {
        return res.status(404).json({ message: "Soup recipe not found" });
      }

      return res.status(200).json(recipe);
    } catch (error) {
      console.error("Error toggling favorite status for soup recipe:", error);
      return res.status(500).json({
        message: "Failed to update the soup recipe favorite status. Please try again."
      });
    }
  });

  // API route to delete a recipe
  app.delete("/api/recipes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid soup recipe ID" });
      }

      const deleted = await storage.deleteRecipe(id);
      if (!deleted) {
        return res.status(404).json({ message: "Soup recipe not found" });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting soup recipe:", error);
      return res.status(500).json({
        message: "Failed to delete the soup recipe. Please try again."
      });
    }
  });

  // Clear all saved recipes
  app.post('/api/recipes/clear-saved', async (req, res) => {
    try {
      await storage.clearSavedRecipes();
      return res.status(200).json({ message: "All saved recipes cleared" });
    } catch (error) {
      console.error("Error clearing saved recipes:", error);
      return res.status(500).json({
        message: "Failed to clear saved recipes. Please try again."
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}