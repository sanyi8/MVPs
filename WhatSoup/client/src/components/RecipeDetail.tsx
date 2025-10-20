import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Clock, ChefHat, Share2, Star, Printer } from "lucide-react";
import { 
  FacebookShareButton
} from "react-share";
import { useToast } from "@/hooks/use-toast";

interface RecipeDetailProps {
  recipe: Recipe;
}

export const RecipeDetail = ({ recipe }: RecipeDetailProps) => {
  const { toast } = useToast();
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Create a URL for sharing
  const recipeUrl = `${window.location.origin}/recipe/${recipe.id}`;
  
  // Mutation for toggling favorite status
  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async () => {
      // Use PATCH as it's what the server currently expects
      const response = await apiRequest('PATCH', `/api/recipes/${recipe.id}/favorite`);
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      // Invalidate recipe queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      
      toast({
        title: recipe.favorite ? "Removed from favorites" : "Added to favorites",
        description: recipe.favorite ? 
          "This recipe has been removed from your favorites" : 
          "This recipe has been added to your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error updating favorite status",
        description: "There was a problem updating this recipe's favorite status",
        variant: "destructive"
      });
    }
  });

  const handlePrint = () => {
    window.print();
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(recipeUrl);
    toast({
      title: "Link copied!",
      description: "Recipe link copied to clipboard"
    });
    setShowShareOptions(false);
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

  return (
    <div className="recipe-detail">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#d34600ff]">{recipe.title}</h1>
        <div className="flex space-x-2">
          
          
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="text-[#cd8444ff] hover:text-[#F95432]"
              aria-label="Share recipe"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            
            {showShareOptions && (
              <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg p-2 border border-neutral-200 z-10">
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start"
                    onClick={handleCopyLink}
                  >
                    Copy link
                  </Button>
                  <FacebookShareButton url={recipeUrl} className="!p-0">
                    <Button variant="ghost" size="sm" className="justify-start w-full">
                      Share on Facebook
                    </Button>
                  </FacebookShareButton>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start"
                    onClick={handlePrint}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print recipe
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-[#788931ff] mr-1" />
          <span className="text-sm font-medium text-[#cd8444ff]">{formatCookTime(recipe.cookTime)}</span>
        </div>
        <div className="flex items-center">
          <ChefHat className="h-4 w-4 text-[#788931ff] mr-1" />
          <span className="text-sm font-medium text-[#cd8444ff]">{recipe.difficulty}</span>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3 text-[#788931ff]">Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, i) => (
            <li key={i} className="flex items-baseline">
              <span className="inline-block h-2 w-2 rounded-full bg-[#788931ff] mr-2 flex-shrink-0 mt-1.5"></span>
              <span className="text-[#cd8444ff]">{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3 text-[#788931ff]">Instructions</h2>
        <ol className="space-y-4">
          {recipe.instructions.map((instruction, i) => (
            <li key={i} className="flex">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#788931ff] text-white text-sm mr-3 flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-[#cd8444ff]">{instruction}</p>
            </li>
          ))}
        </ol>
      </div>
      
      {recipe.notes && (
        <div className="mb-4 p-4 bg-[#f0ece1ff] rounded-md border border-[#cd8444ff]/30">
          <h2 className="text-lg font-medium mb-2 text-[#788931ff]">Notes</h2>
          <p className="text-[#cd8444ff]">{recipe.notes}</p>
        </div>
      )}
      
      {recipe.source && (
        <div className="mt-2 mb-6">
          <h2 className="text-sm font-medium text-[#788931ff] mb-1">Source</h2>
          <a 
            href={recipe.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F95432] hover:underline text-sm break-all"
          >
            {recipe.source}
          </a>
        </div>
      )}
    </div>
  );
};