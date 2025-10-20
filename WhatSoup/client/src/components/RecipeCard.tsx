import { Recipe } from "@/types/recipe";
import { Clock, BarChart2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  isCompact?: boolean;
}

export const RecipeCard = ({ recipe, isCompact = false }: RecipeCardProps) => {
  const { toast } = useToast();

  const { mutate: toggleSave } = useMutation({
    mutationFn: async () => {
      if (recipe.id) {
        const response = await apiRequest('PATCH', `/api/recipes/${recipe.id}/save`);
        return response.json();
      }
      const response = await apiRequest('PATCH', `/api/recipes/0/save`, recipe);
      return response.json();
    },
    onSuccess: (updatedRecipe) => {
      if (updatedRecipe.id) {
        recipe.id = updatedRecipe.id;
      }
      recipe.saved = updatedRecipe.saved;
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      
      toast({
        title: updatedRecipe.saved ? "Recipe saved" : "Recipe removed from saved",
        description: updatedRecipe.saved ? "Added to your saved recipes" : "Removed from your saved recipes",
      });
    }
  });

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave();
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the recipe detail
    if (recipe.id && onDelete) {
      onDelete(recipe.id);
    }
  };

  // Helper function to format cooking time
  const formatCookTime = (cookTime: string) => {
    // Extract the time value from cookTime string
    const timeMatch = cookTime.match(/(\d+)\s*min/i);
    if (!timeMatch) return cookTime; // Return original if no match
    
    const minutes = parseInt(timeMatch[1]);
    
    if (minutes <= 30) return "up to 30min";
    if (minutes <= 45) return "45min";
    if (minutes <= 60) return "1hr";
    return "1hr+";
  };

  if (isCompact) {
    return (
      <div className="recipe-card border-2 border-[#cd8444ff]/20 rounded-lg overflow-hidden bg-white h-full transition-all relative">
        
        
        <div className="p-1 bg-[#F95432]/10 w-full"></div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium soup-header mb-3 line-clamp-2">{recipe.title}</h3>
          
          <div className="flex items-center text-sm text-[#cd8444ff] font-medium">
            <span className="flex items-center mr-4">
              <Clock className="h-4 w-4 mr-1 text-[#788931ff]" />
              {formatCookTime(recipe.cookTime)}
            </span>
            <span className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-1 text-[#788931ff]" />
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-card border-2 border-[#cd8444ff]/20 rounded-lg overflow-hidden relative bg-white">
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button 
          className="favorite-button"
          onClick={handleFavoriteClick}
          aria-label={recipe.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star 
            className={cn(
              "h-6 w-6 transition-all", 
              recipe.favorite 
                ? "text-[#F95432]" 
                : "text-[#cd8444ff]"
            )} 
            fill={recipe.favorite ? "#F95432" : "none"}
            strokeWidth={1.5}
          />
        </button>
        
        {onDelete && recipe.id && (
          <button 
            className="delete-button text-neutral-400 hover:text-red-500 transition-colors"
            onClick={handleDeleteClick}
            aria-label="Delete recipe"
          >
            <Trash 
              className="h-6 w-6" 
              strokeWidth={1.5}
            />
          </button>
        )}
      </div>
      
      <div className="p-1 bg-[#F95432]/10 w-full"></div>
    
      <div className="p-5">
        <h3 className="text-xl font-bold soup-header mb-3 pr-10">{recipe.title}</h3>
        
        <div className="flex items-center text-sm text-[#cd8444ff] font-medium mb-4">
          <span className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1 text-[#788931ff]" />
            {formatCookTime(recipe.cookTime)}
          </span>
          <span className="flex items-center">
            <BarChart2 className="h-4 w-4 mr-1 text-[#788931ff]" />
            {recipe.difficulty}
          </span>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-[#788931ff] mb-2 border-b border-[#cd8444ff]/20 pb-1">Ingredients:</h4>
          <ul className="text-sm text-[#cd8444ff] space-y-1 pl-5 list-disc">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-[#788931ff] mb-2 border-b border-[#cd8444ff]/20 pb-1">Instructions:</h4>
          <ol className="text-sm text-[#cd8444ff] space-y-1 pl-5 list-decimal">
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
        
        {recipe.notes && (
          <div className="mt-6 p-3 bg-[#788931ff]/5 rounded-md border border-[#cd8444ff]/20">
            <h4 className="text-sm font-medium text-[#788931ff] mb-1">Chef's Notes:</h4>
            <p className="text-sm text-[#cd8444ff]">{recipe.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
