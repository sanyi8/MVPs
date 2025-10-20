import { Card } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";
import { TipsyLevel } from "@/types";
import { useState } from "react";
import { calculateTipsyLevel } from "@/lib/calculator";

interface TipsyResultProps {
  tipsyLevel: TipsyLevel;
  totalPoints: number;
  hasMixedDrinks: boolean;
}

export default function TipsyResult({ 
  tipsyLevel, 
  totalPoints, 
  hasMixedDrinks 
}: TipsyResultProps) {
  const [showWarning, setShowWarning] = useState(true);
  const { toast } = useToast();
  const { settings } = useSettings();

  // Calculate the adjusted points for mixed drinks (20% increase)
  const adjustedPoints = hasMixedDrinks ? Math.round(totalPoints * 1.2) : totalPoints;
  const adjustedTipsyLevel = hasMixedDrinks ? calculateTipsyLevel(adjustedPoints) : tipsyLevel;

  // Determine which progress bar width and tipsy level to display
  const progressBarWidth = Math.min(100, (adjustedPoints / 100) * 100);
  const displayTipsyLevel = hasMixedDrinks ? adjustedTipsyLevel : tipsyLevel;

  return (
    <Card>
      {/* Progress bar */}
      <div className="relative h-4 bg-gray-200">
        <div 
          className={`absolute h-full ${displayTipsyLevel.barColor} transition-all duration-500`} 
          style={{ width: `${progressBarWidth}%` }}
        ></div>
        
        {/* Show original level marker if mixed drinks */}
        {hasMixedDrinks && (
          <div 
            className="absolute h-full border-r-2 border-gray-700 z-10"
            style={{ left: `${Math.min(100, (totalPoints / 100) * 100)}%` }}
          ></div>
        )}
      </div>

      <div className="p-4">
        <div className="text-center mb-4">
          <div className={`${displayTipsyLevel.text === 'All Good' ? 'text-4xl' : 'text-6xl'} font-bold ${displayTipsyLevel.barColor === 'bg-emerald-500' ? 'text-green-600' : displayTipsyLevel.barColor === 'bg-amber-500' ? 'text-yellow-600' : 'text-red-600'}`}>
            {displayTipsyLevel.text}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-2">
            <span className="text-2xl font-medium text-gray-700">
              {hasMixedDrinks ? adjustedPoints : totalPoints}
            </span>
            <span className="text-sm text-gray-500">
              points
            </span>
          </div>
          {hasMixedDrinks && (
            <div className="text-xs text-amber-600 mt-1">
              Mixed drinks: +20% boost (was {totalPoints} points)
            </div>
          )}
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-600 text-sm">
            {displayTipsyLevel.message}
          </p>
        </div>
        
        
        
        {/* Mixed drinks warning */}
        {hasMixedDrinks && showWarning && (
          <div 
            className="bg-amber-50 border border-amber-200 rounded-lg p-3 cursor-pointer"
            onClick={() => setShowWarning(false)}
          >
            <div className="flex items-start space-x-2">
              <span className="text-amber-500">⚠️</span>
              <div>
                <p className="text-sm text-amber-800 font-medium">
                  Mixed drinks detected
                </p>
                <p className="text-xs text-amber-600">
                  Your tipsy level increased by 20% (from {totalPoints} to {adjustedPoints} points)
                </p>
                <p className="text-xs text-amber-500 mt-1">Tap to dismiss</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}