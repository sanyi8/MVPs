import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DrinkType } from "@/types";
import CustomDrinkForm from "./CustomDrinkForm";

interface DrinkSelectorProps {
  onAddDrink: (type: DrinkType, amount: number, customName?: string, customEmoji?: string, customPercentage?: number) => void;
  customDrinks: any[];
  progressBarWidth?: number;
  displayTipsyLevel?: any;
}

export default function DrinkSelector({ onAddDrink, customDrinks, progressBarWidth = 0, displayTipsyLevel }: DrinkSelectorProps) {
  const [showCustomForm, setShowCustomForm] = useState(false);

  const quickAddDrink = (type: DrinkType, amount: number, customName?: string, emoji?: string, percentage?: number) => {
    onAddDrink(type, amount, customName, emoji, percentage);
  };

  return (
    <div className="space-y-4">
      {/* Water Section - Prominently Featured */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                💧
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Stay Hydrated</h3>
                <p className="text-sm text-blue-700">Drink water to reduce your tipsy level</p>
              </div>
            </div>
            <Button 
              onClick={() => quickAddDrink('water', 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              + Water
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alcohol Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-medium text-gray-900">Add drinks</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCustomForm(true)}
              className="text-xs"
            >
              + Custom
            </Button>
          </div>

          {/* Quick Add Buttons Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => quickAddDrink('beer', 5)}
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-yellow-50 border-yellow-200 transition-colors"
            >
              <span className="text-xl">🍺</span>
              <div className="text-left">
                <div className="font-medium text-sm">Beer</div>
                <div className="text-xs text-gray-500">500ml (5%)</div>
              </div>
            </button>

            <button
              onClick={() => quickAddDrink('wine', 2)}
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-purple-50 border-purple-200 transition-colors"
            >
              <span className="text-xl">🍷</span>
              <div className="text-left">
                <div className="font-medium text-sm">Wine</div>
                <div className="text-xs text-gray-500">200ml (12%)</div>
              </div>
            </button>

            <button
              onClick={() => quickAddDrink('spirits', 0.5)}
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-orange-50 border-orange-200 transition-colors"
            >
              <span className="text-xl">🥃</span>
              <div className="text-left">
                <div className="font-medium text-sm">Spirits</div>
                <div className="text-xs text-gray-500">50ml (40%)</div>
              </div>
            </button>

            <button
              onClick={() => quickAddDrink('beer', 3.3)}
              className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-yellow-50 border-yellow-200 transition-colors"
            >
              <span className="text-xl">🍻</span>
              <div className="text-left">
                <div className="font-medium text-sm">Bottle</div>
                <div className="text-xs text-gray-500">330ml (5%)</div>
              </div>
            </button>
          </div>

          {/* Custom Drinks */}
          {customDrinks.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Your Custom Drinks</h4>
              <div className="grid grid-cols-1 gap-2">
                {customDrinks.map((drink, index) => (
                  <button
                    key={index}
                    onClick={() => quickAddDrink('spirits', 0.5, drink.name, drink.emoji, drink.alcoholPercentage)}
                    className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">{drink.emoji || '🥃'}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{drink.name}</div>
                      <div className="text-xs text-gray-500">50ml ({drink.alcoholPercentage}%)</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showCustomForm && (
        <Card>
          <CardContent className="p-4">
            <CustomDrinkForm
              onAddCustomDrink={(customDrink) => {
                onAddDrink('custom', customDrink.amount, customDrink.name, customDrink.emoji, customDrink.alcoholPercentage);
                setShowCustomForm(false);
              }}
            />
            <Button 
              variant="outline" 
              onClick={() => setShowCustomForm(false)}
              className="mt-2 w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}