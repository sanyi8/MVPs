
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Drink, DrinkType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { DRINK_POINTS } from "@/lib/calculator";

interface CustomDrinkFormProps {
  onAddCustomDrink: (drink: Omit<Drink, "id" | "sessionId"> & { 
    name: string,
    emoji?: string, 
    bgColor?: string,
    alcoholPercentage: number 
  }) => void;
}

const EMOJIS = ["🍹", "🥃", "🍸", "🍷", "🍺", "🍻", "🥂", "🧉", "🍶", "🧋", "🥤"];
const COLORS = [
  { name: "Purple", value: "bg-purple-100" },
  { name: "Blue", value: "bg-blue-100" },
  { name: "Red", value: "bg-red-100" },
  { name: "Green", value: "bg-green-100" },
  { name: "Amber", value: "bg-amber-200" },
  { name: "Yellow", value: "bg-yellow-100" },
  { name: "Pink", value: "bg-pink-100" },
  { name: "Indigo", value: "bg-indigo-100" },
];

export default function CustomDrinkForm({ onAddCustomDrink }: CustomDrinkFormProps) {
  const [name, setName] = useState<string>("");
  const [alcoholPercentage, setAlcoholPercentage] = useState<string>("40");
  const [sizeInMl, setSizeInMl] = useState<string>("100");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("🥃");
  const [selectedColor, setSelectedColor] = useState<string>("bg-blue-100");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a drink name",
        variant: "destructive"
      });
      return;
    }
    
    const alcoholPercent = parseFloat(alcoholPercentage);
    const sizeInMilliliters = parseFloat(sizeInMl);
    
    if (isNaN(alcoholPercent)) {
      toast({
        title: "Error",
        description: "Alcohol percentage must be a number",
        variant: "destructive"
      });
      return;
    }

    if (alcoholPercent <= 0) {
      toast({
        title: "Error", 
        description: "Alcohol percentage must be positive",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(sizeInMilliliters) || sizeInMilliliters <= 0) {
      toast({
        title: "Error",
        description: "Size must be a positive number",
        variant: "destructive"
      });
      return;
    }
    
    // Convert to dl - 100ml = 1dl
    const amountInDl = sizeInMilliliters / 100;
    
    // Calculate points using the same formula as spirits: alcohol * amount
    // For example: 40% whiskey in 1dl = 40 points (same as 40% DRINK_POINTS.spirits)
    const points = Math.round(alcoholPercent * amountInDl / 100 * 100); // Convert percentage to decimal, multiply by dl, *100 like DRINK_POINTS
    
    // Check if total points are positive
    if (points <= 0) {
      toast({
        title: "Invalid drink",
        description: "The drink must have a positive amount of alcohol.",
        variant: "destructive"
      });
      return;
    }
    
    const customDrink = {
      type: "spirits" as DrinkType, // Use spirits as the base type
      amount: amountInDl,
      points: points,
      name: name,
      emoji: selectedEmoji,
      bgColor: selectedColor,
      alcoholPercentage: alcoholPercent
    };
    
    onAddCustomDrink(customDrink);
    
    toast({
      title: "Custom drink created!",
      description: `Created ${name} with ${alcoholPercent}% alcohol.`,
      duration: 3000,
    });
    
    // Don't reset fields to make it easier to create similar drinks
    // setName("");
    // setAlcoholPercentage("40");
    // setSizeInMl("100");
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="drink-name">Drink Name</Label>
        <Input
          id="drink-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Whiskey, Cocktail, etc."
        />
      </div>
      
      <div>
        <Label htmlFor="alcohol-percentage">Alcohol Percentage (%)</Label>
        <Input
          id="alcohol-percentage"
          type="number"
          min="0.1"
          step="0.1"
          value={alcoholPercentage}
          onChange={(e) => setAlcoholPercentage(e.target.value)}
          placeholder="40"
        />
        <p className="text-xs text-gray-500 mt-1">Enter the percentage (e.g., 40 for 40%)</p>
      </div>
      
      <div>
        <Label htmlFor="size-ml">Size (ml)</Label>
        <Input
          id="size-ml"
          type="number"
          min="1"
          step="1"
          value={sizeInMl}
          onChange={(e) => setSizeInMl(e.target.value)}
          placeholder="100"
        />
        <p className="text-xs text-gray-500 mt-1">Enter in milliliters (e.g., 100 for a shot)</p>
      </div>
      
      <div>
        <Label>Select Emoji</Label>
        <div className="flex flex-wrap gap-2 mt-2 mb-1">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`h-10 w-10 rounded-full flex items-center justify-center text-xl ${
                selectedEmoji === emoji ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <Label>Select Background Color</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              className={`h-8 w-8 rounded-full ${color.value} ${
                selectedColor === color.value ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'
              }`}
              onClick={() => setSelectedColor(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full">
          Add Drink
        </Button>
      </div>
    </form>
  );
}
