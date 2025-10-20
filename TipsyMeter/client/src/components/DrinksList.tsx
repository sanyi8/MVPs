import { Card, CardContent } from "@/components/ui/card";
import { Drink } from "@/types";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const DRINK_EMOJI: Record<string, string> = {
  beer: "🍺",
  wine: "🍷",
  spirits: "🥃",
  water: "💧",
  custom: "🍹"
};

interface DrinkWithCustomInfo extends Drink {
  customName?: string;
  customEmoji?: string;
}

interface DrinksListProps {
  drinks: DrinkWithCustomInfo[];
  totalPoints: number;
  onRemoveDrink: (index: number) => void;
  progressBarWidth?: number;
  displayTipsyLevel?: any;
}

export default function DrinksList({ 
  drinks, 
  totalPoints, 
  onRemoveDrink,
  progressBarWidth,
  displayTipsyLevel
}: DrinksListProps) {
  // Count water drinks to show encouragement
  const waterCount = drinks.filter(drink => drink.type === 'water').length;
  const alcoholCount = drinks.filter(drink => drink.type !== 'water').length;
  const [isExpanded, setIsExpanded] = useState(false);

  // Create drink summary
  const getDrinkSummary = () => {
    const drinkCounts = drinks.reduce((acc, drink) => {
      const key = drink.type === 'water' ? 'water' : (drink.customName || drink.type);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(drinkCounts)
      .map(([type, count]) => `${count}x${type}`)
      .join(' and ');
  };
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [drinkToDelete, setDrinkToDelete] = useState<number | null>(null);

  const handleDeleteClick = (index: number) => {
    setDrinkToDelete(index);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (drinkToDelete !== null) {
      onRemoveDrink(drinkToDelete);
    }
    setIsDeleteDialogOpen(false);
  };

  if (drinks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4">
        {/* Collapsible header */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-between items-center hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
        >
          <div className="text-left">
            <h2 className="font-medium text-gray-900">Your drinks tonight</h2>
            <p className="text-sm text-gray-600">{getDrinkSummary()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {drinks.length} drink{drinks.length !== 1 ? 's' : ''}
            </span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="mt-4 space-y-3">
            {/* Water Encouragement */}
            {alcoholCount > 0 && waterCount < Math.ceil(alcoholCount / 2) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">💧</span>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">
                      Stay hydrated! Consider adding water.
                    </p>
                    <p className="text-xs text-blue-600">
                      You've had {alcoholCount} alcoholic drink{alcoholCount !== 1 ? 's' : ''} and {waterCount} glass{waterCount !== 1 ? 'es' : ''} of water
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Water Achievement */}
            {waterCount >= Math.ceil(alcoholCount / 2) && alcoholCount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">✅</span>
                  <div>
                    <p className="text-sm text-green-800 font-medium">
                      Great job staying hydrated!
                    </p>
                    <p className="text-xs text-green-600">
                      You're maintaining a good water-to-alcohol ratio
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {drinks.map((drink, index) => (
                <div 
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg border ${
                    drink.type === 'water' 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-lg ${
                      drink.type === 'water' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {drink.customEmoji || DRINK_EMOJI[drink.type] || '🍹'}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm ${
                        drink.type === 'water' ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {drink.type === 'water' 
                          ? 'Glass of water'
                          : `${Math.round(drink.amount * 100)}ml ${drink.customName || drink.type}`
                        }
                      </div>
                      {drink.customPercentage && (
                        <div className="text-xs text-gray-500">
                          {drink.customPercentage}% alcohol
                        </div>
                      )}
                      {drink.points < 0 && (
                        <div className="text-xs text-green-600 font-medium">
                          {drink.points} points (reduces tipsy level)
                        </div>
                      )}
                      {drink.points > 0 && (
                        <div className="text-xs text-orange-600">
                          +{drink.points} points
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                    onClick={() => handleDeleteClick(index)}
                    aria-label="Remove drink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Drink</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this drink? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardContent>
    </Card>
  );
}