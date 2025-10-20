import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";

interface IngredientFormProps {
  onGenerateRecipe: (ingredients: string) => void;
}

interface ExampleSet {
  name: string;
  ingredients: string;
}

export const IngredientForm = ({ onGenerateRecipe }: IngredientFormProps) => {
  const [ingredients, setIngredients] = useState<string>("");

  const exampleSets: ExampleSet[] = [
    { name: "Chicken Soup", ingredients: "chicken, carrots, celery, onion, garlic" },
    { name: "Vegetable Soup", ingredients: "carrots, potatoes, peas, onion, vegetable broth" },
    { name: "Tomato Soup", ingredients: "tomatoes, onion, garlic, basil, cream" },
    { name: "Hearty Stew", ingredients: "beef, potatoes, carrots, onion, mushrooms" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateRecipe(ingredients);
  };

  const handleClear = () => {
    setIngredients("");
  };

  const handleExampleClick = (example: string) => {
    setIngredients(example);
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2 className="text-xl font-bold soup-header mb-2">What ingredients do you have?</h2>
      <p className="text-neutral-600 mb-6">
        Enter the ingredients you have on hand, and we'll generate delicious soup recipes just for you!
      </p>
      
      <div className="mb-5">
        <Label htmlFor="ingredients" className="block soup-header font-medium mb-2">
          Your Soup Ingredients
        </Label>
        <Textarea
          id="ingredients"
          rows={4}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-[#f0ece1] text-[#7A950B] placeholder:text-[#7A950B]/70 font-bold"
          placeholder="e.g., chicken, carrots, celery, onion, garlic, broth"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <p className="mt-2 text-sm text-neutral-500">Separate ingredients with commas</p>
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          type="submit"
          className="inline-flex items-center bg-[#C5E05A] text-black hover:bg-[#C5E05A]/90 border-none"
        >
          <span>Create Soup Recipe</span>
          <Zap className="ml-2 h-5 w-5" />
        </Button>
        
        <Button
          type="button"
          className="bg-[#f6d7aeff]/30 text-[#cd8444ff] hover:bg-[#f6d7aeff]/50 border-none text-sm font-medium"
          onClick={handleClear}
        >
          Clear ingredients
        </Button>
      </div>
      
      {/* Examples Section */}
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <h3 className="text-sm font-medium text-[#788931ff] mb-3">Popular Examples:</h3>
        <div className="flex flex-wrap gap-2">
          {exampleSets.map((example, index) => (
            <Button
              key={index}
              type="button"
              className="text-xs px-3 py-1.5 bg-[#F95432]/10 text-[#F95432] hover:bg-[#F95432]/20 border-[#F95432]/20 font-medium rounded-full transition-colors h-auto"
              onClick={() => handleExampleClick(example.ingredients)}
            >
              {example.name}
            </Button>
          ))}
        </div>
      </div>
    </form>
  );
};
