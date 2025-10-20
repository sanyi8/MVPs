import { useState, useMemo } from "react";
import { IngredientForm } from "@/components/IngredientForm";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeGrid } from "@/components/RecipeGrid";
import { TimeFilter } from "@/components/TimeFilter";
import { CuisineFilter } from "@/components/CuisineFilter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookSvg } from "@/components/ui/book-svg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Recipe } from "@/types/recipe";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState<string>("");
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<string>("generate");
  const [timeFilters, setTimeFilters] = useState<string[]>([]);
  const [cuisineFilters, setCuisineFilters] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Function to filter recipes by time
  const filterRecipesByTime = (recipe: Recipe): boolean => {
    if (timeFilters.length === 0) return true;
    
    const cookTime = recipe.cookTime.toLowerCase();
    const minutes = parseTimeToMinutes(cookTime);
    
    if (timeFilters.includes('quick') && minutes <= 30) {
      return true;
    }
    
    if (timeFilters.includes('medium') && minutes > 30 && minutes <= 45) {
      return true;
    }
    
    if (timeFilters.includes('long') && minutes > 45 && minutes <= 60) {
      return true;
    }
    
    if (timeFilters.includes('extended') && minutes > 60) {
      return true;
    }
    
    return false;
  };
  
  // Helper function to parse cooking time to minutes
  const parseTimeToMinutes = (cookTime: string): number => {
    // Check for hour formats
    if (cookTime.includes('hour') || cookTime.includes('hr')) {
      // Extract hours
      const hourMatch = cookTime.match(/(\d+)\s*(?:hour|hr)/i);
      const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
      
      // Extract minutes if present
      const minuteMatch = cookTime.match(/(\d+)\s*min/i);
      const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
      
      return hours * 60 + minutes;
    }
    
    // Just minutes format
    const minuteMatch = cookTime.match(/(\d+)\s*min/i);
    if (minuteMatch) {
      return parseInt(minuteMatch[1]);
    }
    
    // Try to parse a plain number
    const plainNumber = parseInt(cookTime);
    if (!isNaN(plainNumber)) {
      return plainNumber;
    }
    
    // Default if we can't parse it
    return 45; // Middle value as fallback
  };
  
  // Function to filter recipes by cuisine
  const filterRecipesByCuisine = (recipe: Recipe): boolean => {
    if (cuisineFilters.length === 0) return true;
    
    const title = recipe.title.toLowerCase();
    const ingredients = recipe.ingredients.join(' ').toLowerCase();
    const instructions = recipe.instructions.join(' ').toLowerCase();
    const notes = recipe.notes?.toLowerCase() || '';
    const allText = `${title} ${ingredients} ${instructions} ${notes}`;
    
    return cuisineFilters.some(cuisine => {
      switch (cuisine) {
        // Regional cuisines
        case 'eastern-european':
          return allText.includes('eastern european') || 
                 allText.includes('hungarian') || 
                 allText.includes('polish') ||
                 allText.includes('russian') ||
                 allText.includes('ukrainian') ||
                 allText.includes('goulash') ||
                 allText.includes('borscht') ||
                 allText.includes('paprika');
        case 'italian':
          return allText.includes('italian') || 
                 allText.includes('minestrone') || 
                 allText.includes('pasta e fagioli') ||
                 allText.includes('ribollita') ||
                 allText.includes('parmesan') ||
                 allText.includes('tuscan');
        case 'asian':
          return allText.includes('asian') || 
                 allText.includes('chinese') || 
                 allText.includes('japanese') ||
                 allText.includes('thai') ||
                 allText.includes('korean') ||
                 allText.includes('vietnamese') ||
                 allText.includes('pho') ||
                 allText.includes('miso') ||
                 allText.includes('ramen') ||
                 allText.includes('wonton') ||
                 allText.includes('soy sauce') ||
                 allText.includes('lemongrass');
        case 'mediterranean':
          return allText.includes('mediterranean') || 
                 allText.includes('greek') || 
                 allText.includes('spanish') ||
                 allText.includes('avgolemono') ||
                 allText.includes('gazpacho') ||
                 allText.includes('olive oil') ||
                 allText.includes('feta');
        case 'french':
          return allText.includes('french') || 
                 allText.includes('bouillabaisse') || 
                 allText.includes('onion soup') ||
                 allText.includes('vichyssoise') ||
                 allText.includes('ratatouille') ||
                 allText.includes('pistou');
        case 'latin':
          return allText.includes('latin') || 
                 allText.includes('mexican') || 
                 allText.includes('sopa de lima') ||
                 allText.includes('pozole') ||
                 allText.includes('tortilla soup') ||
                 allText.includes('brazilian') ||
                 allText.includes('peruvian') ||
                 allText.includes('cilantro');
        case 'middle-eastern':
          return allText.includes('middle eastern') || 
                 allText.includes('harira') || 
                 allText.includes('lentil') ||
                 allText.includes('moroccan') ||
                 allText.includes('turkish') ||
                 allText.includes('cumin') ||
                 allText.includes('chickpea');
        case 'nordic':
          return allText.includes('nordic') || 
                 allText.includes('scandinavian') || 
                 allText.includes('swedish') ||
                 allText.includes('finnish') ||
                 allText.includes('norwegian') ||
                 allText.includes('fish soup') ||
                 allText.includes('lohikeitto') ||
                 allText.includes('dill');
                 
        // Soup types
        case 'hearty':
          return allText.includes('hearty') || 
                 allText.includes('goulash') || 
                 allText.includes('fisherman') ||
                 allText.includes('stew') ||
                 allText.includes('chunky') ||
                 allText.includes('thick');
        case 'vegetable':
          return allText.includes('vegetable') || 
                 allText.includes('vegan') || 
                 allText.includes('vegetarian') ||
                 allText.includes('garden') ||
                 allText.includes('carrot') ||
                 allText.includes('tomato') ||
                 allText.includes('broccoli');
        case 'broth':
          return allText.includes('broth') || 
                 allText.includes('consommé') || 
                 allText.includes('bouillon') ||
                 allText.includes('clear soup') ||
                 allText.includes('stock');
        case 'cream':
          return allText.includes('cream') || 
                 allText.includes('creamy') || 
                 allText.includes('chowder') ||
                 allText.includes('bisque') ||
                 allText.includes('dairy') ||
                 allText.includes('milk') ||
                 allText.includes('heavy cream');
        default:
          return false;
      }
    });
  };
  
  const handleTimeFilterChange = (filters: string[]) => {
    setTimeFilters(filters);
  };
  
  const handleCuisineFilterChange = (filters: string[]) => {
    setCuisineFilters(filters);
  };

  // Query to fetch all saved recipes
  const { 
    data: savedRecipes, 
    isLoading: isSavedRecipesLoading, 
    isError: isSavedRecipesError,
    refetch: refetchSavedRecipes
  } = useQuery({
    queryKey: ['/api/recipes'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/recipes');
      const data = await response.json();
      return data as Recipe[];
    }
  });

  // Mutation for generating new recipes
  const { 
    mutate: generateRecipes,
    isPending: isLoading,
    isError,
    reset: resetMutationState
  } = useMutation({
    mutationFn: async (ingredientsStr: string) => {
      const response = await apiRequest('POST', '/api/recipes', { ingredients: ingredientsStr });
      const data = await response.json();
      return data as Recipe[];
    },
    onSuccess: (data) => {
      // Remove duplicates from generated recipes
      const uniqueRecipes = data.filter((recipe, index, self) =>
        index === self.findIndex((r) => r.title === recipe.title)
      );

      // Check for matches with saved recipes and mark as favorite
      if (savedRecipes) {
        uniqueRecipes.forEach(recipe => {
          const existingRecipe = savedRecipes.find(saved => saved.title === recipe.title);
          if (existingRecipe) {
            recipe.id = existingRecipe.id;
            recipe.favorite = existingRecipe.favorite;
          }
        });
      }

      setRecipes(uniqueRecipes);
      // Automatically refresh the saved recipes list
      refetchSavedRecipes();
      // Switch to the generated tab to show results
      setActiveTab("generate");
    },
    onError: (error) => {
      toast({
        title: "Error generating soup recipes",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleGenerateRecipe = async (ingredientsInput: string) => {
    if (!ingredientsInput.trim()) {
      toast({
        title: "No ingredients provided",
        description: "Please enter at least one ingredient",
        variant: "destructive"
      });
      return;
    }

    setIngredients(ingredientsInput);
    setHasSubmitted(true);
    generateRecipes(ingredientsInput);
  };

  const handleGenerateMore = () => {
    if (ingredients) {
      generateRecipes(ingredients);
    }
  };

  const handleTryAgain = () => {
    resetMutationState();
    generateRecipes(ingredients);
  };

  // Filter recipes using useMemo for better performance
  const filteredGeneratedRecipes = useMemo(() => {
    return recipes
      .filter(filterRecipesByTime)
      .filter(filterRecipesByCuisine);
  }, [recipes, timeFilters, cuisineFilters]);
  
  const filteredSavedRecipes = useMemo(() => {
    return savedRecipes 
      ? savedRecipes.filter(filterRecipesByTime).filter(filterRecipesByCuisine) 
      : [];
  }, [savedRecipes, timeFilters, cuisineFilters]);

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6 lg:mb-0">
        <IngredientForm onGenerateRecipe={handleGenerateRecipe} />
      </div>

      {/* Results Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        {/* When we have no content yet, show initial state */}
        {!hasSubmitted && (!savedRecipes || savedRecipes.length === 0) && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <BookSvg className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-neutral-700 mb-2">No soup recipes yet</h3>
            <p className="text-neutral-500 max-w-sm mx-auto">
              Enter the ingredients you have on hand, and we'll generate some delicious soup recipes for you.
            </p>
          </div>
        )}

        {/* When we have content to show, use tabs */}
        {(hasSubmitted || (savedRecipes && savedRecipes.length > 0)) && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="generate" className="flex-1">
                New Recipes
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex-1">
                Saved Recipes
                {savedRecipes && savedRecipes.length > 0 && (
                  <span className="ml-2 bg-primary/20 text-primary/90 text-xs px-2 py-1 rounded-full">
                    {savedRecipes.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Generated Recipes Tab Content */}
            <TabsContent value="generate" className="mt-0">
              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-700">Cooking up ideas...</h3>
                  <p className="text-neutral-500 max-w-sm mx-auto mt-2">
                    We're searching for the perfect soup recipes with your ingredients.
                  </p>
                </div>
              )}

              {/* Error State */}
              {isError && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <AlertCircle className="h-12 w-12 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-red-700 mb-2">Oops! Something went wrong</h3>
                  <p className="text-neutral-500 max-w-sm mx-auto">
                    We couldn't generate soup recipes right now. Please try again later or check your input.
                  </p>
                  <Button 
                    className="mt-4 bg-[#2b2d42] text-[#edf2f4] hover:bg-[#2b2d42]/90 border-none"
                    onClick={handleTryAgain}
                  >
                    Try again
                  </Button>
                </div>
              )}

              {/* Empty State (when submitted but no results yet) */}
              {hasSubmitted && recipes.length === 0 && !isLoading && !isError && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <BookSvg className="h-12 w-12 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-700 mb-2">No soup recipes generated</h3>
                  <p className="text-neutral-500 max-w-sm mx-auto">
                    Try different ingredients to get soup recipe suggestions.
                  </p>
                </div>
              )}

              {/* Results State */}
              {recipes.length > 0 && !isLoading && !isError && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Soup Recipes</h2>
                    <span className="text-sm bg-primary/20 text-primary/90 px-2 py-1 rounded-full">
                      {filteredGeneratedRecipes.length} / {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                    </span>
                  </div>
                  
                  {/* Filters */}
                  <TimeFilter onFilterChange={handleTimeFilterChange} />
                  <CuisineFilter onFilterChange={handleCuisineFilterChange} />

                  {/* Recipe Grid */}
                  <RecipeGrid recipes={filteredGeneratedRecipes} />
                  
                  {/* Generate More Button */}
                  <Button 
                    className="mt-6 w-full bg-[#2b2d42] text-[#edf2f4] hover:bg-[#2b2d42]/90 border-none"
                    onClick={handleGenerateMore}
                  >
                    Generate more soup recipes
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Saved Recipes Tab Content */}
            <TabsContent value="saved" className="mt-0">
              {/* Loading State */}
              {isSavedRecipesLoading && (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-700">Loading soup recipes...</h3>
                </div>
              )}

              {/* Error State */}
              {isSavedRecipesError && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <AlertCircle className="h-12 w-12 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-red-700 mb-2">Couldn't load saved soup recipes</h3>
                  <Button 
                    className="mt-4 bg-[#2b2d42] text-[#edf2f4] hover:bg-[#2b2d42]/90 border-none"
                    onClick={() => refetchSavedRecipes()}
                  >
                    Try again
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {savedRecipes && savedRecipes.length === 0 && !isSavedRecipesLoading && !isSavedRecipesError && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <BookSvg className="h-12 w-12 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-700 mb-2">No saved soup recipes yet</h3>
                  <p className="text-neutral-500 max-w-sm mx-auto">
                    Generate some soup recipes with your ingredients, and they'll be saved here automatically.
                  </p>
                </div>
              )}

              {/* Results State */}
              {savedRecipes && savedRecipes.length > 0 && !isSavedRecipesLoading && !isSavedRecipesError && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Saved Recipes</h2>
                    <span className="text-sm bg-primary/20 text-primary/90 px-2 py-1 rounded-full">
                      {filteredSavedRecipes.length} / {savedRecipes.length} {savedRecipes.length === 1 ? 'recipe' : 'recipes'}
                    </span>
                  </div>
                  
                  {/* Filters */}
                  <TimeFilter onFilterChange={handleTimeFilterChange} />
                  <CuisineFilter onFilterChange={handleCuisineFilterChange} />

                  {/* Recipe Grid */}
                  <RecipeGrid recipes={filteredSavedRecipes} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};
