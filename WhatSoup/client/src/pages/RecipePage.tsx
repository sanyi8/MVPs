import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Recipe } from "@/types/recipe";
import { RecipeDetail } from "@/components/RecipeDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function RecipePage() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  
  const { 
    data: recipe, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['/api/recipes', id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/recipes/${id}`);
      const data = await response.json();
      return data as Recipe;
    }
  });

  const handleGoBack = () => {
    setLocation("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={handleGoBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to recipes
      </Button>
      
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-neutral-700">Loading recipe...</h3>
        </div>
      )}
      
      {isError && (
        <div className="p-6 text-center bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Recipe not found</h2>
          <p className="text-neutral-600 mb-4">
            Sorry, we couldn't find the recipe you're looking for. It may have been deleted or doesn't exist.
          </p>
          <Button onClick={handleGoBack}>
            Return to homepage
          </Button>
        </div>
      )}
      
      {recipe && !isLoading && !isError && (
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <RecipeDetail recipe={recipe} />
        </div>
      )}
    </div>
  );
}