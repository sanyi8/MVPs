
import { useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeDetail } from "@/components/RecipeDetail";
import { Drawer } from "vaul";
import { Recipe } from "@/types/recipe";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, PanInfo } from "framer-motion";
import { RefreshCcw } from "lucide-react";

interface RecipeGridProps {
  recipes: Recipe[];
}

export const RecipeGrid = ({ recipes }: RecipeGridProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);
  const { toast } = useToast();

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async (recipe: Recipe) => {
      const response = await apiRequest('PATCH', `/api/recipes/${recipe.id || 0}/favorite`, !recipe.id ? recipe : undefined);
      return response.json();
    },
    onSuccess: (updatedRecipe) => {
      if (updatedRecipe.id) {
        const recipeToUpdate = recipes.find(r => r.title === updatedRecipe.title);
        if (recipeToUpdate) {
          recipeToUpdate.id = updatedRecipe.id;
          recipeToUpdate.favorite = updatedRecipe.favorite;
        }
      }
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
    }
  });

  const handleDragEnd = (recipe: Recipe, info: PanInfo) => {
    if (info.offset.x < -100) {
      toggleSave(recipe);
    }
  };

  const { mutate: toggleSave } = useMutation({
    mutationFn: async (recipe: Recipe) => {
      const response = await apiRequest('PATCH', `/api/recipes/${recipe.id || 0}/save`, !recipe.id ? recipe : undefined);
      return response.json();
    },
    onSuccess: (updatedRecipe) => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
    }
  });

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsOpen(true);
  };

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortNewest) {
      return (b.id || 0) - (a.id || 0);
    }
    return (a.id || 0) - (b.id || 0);
  });

  return (
    <div>
      {recipes.length > 0 && (
        <button 
          onClick={() => setSortNewest(!sortNewest)}
          className="mb-4 flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <RefreshCcw className={`h-4 w-4 transition-transform ${sortNewest ? '' : 'rotate-180'}`} />
          {sortNewest ? 'Showing Newest First' : 'Showing Oldest First'}
        </button>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedRecipes.map((recipe, index) => (
          <div 
            key={`recipe-${recipe.id || index}`}
            onClick={() => handleRecipeClick(recipe)}
            className="cursor-pointer"
          >
            <RecipeCard recipe={recipe} isCompact={true} />
          </div>
        ))}
      </div>

      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
            <div className="p-4 bg-white rounded-t-[10px] flex-1 overflow-auto">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-neutral-300 mb-8" />
              <div className="max-w-3xl mx-auto">
                {selectedRecipe && <RecipeDetail recipe={selectedRecipe} />}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};
