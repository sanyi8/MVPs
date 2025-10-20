import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import DrinkSelector from "./DrinkSelector";
import DrinksList from "./DrinksList";
import TipsyResult from "./TipsyResult";
import SocialActions from "./SocialActions";
import SettingsPanel, { AppSettings } from "./SettingsPanel";
import CustomDrinkForm from "./CustomDrinkForm";
import { Button } from "@/components/ui/button";
import { Drink, DrinkType } from "@/types";
import { calculateTipsyLevel, DRINK_POINTS } from "@/lib/calculator";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";
import { apiRequest } from "@/lib/queryClient";
import { Settings as SettingsIcon } from "lucide-react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

export default function TipsyCalculator() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [hasMixedDrinks, setHasMixedDrinks] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [waterTimestamps, setWaterTimestamps] = useState<Date[]>([]);
  const [waterButtonDisabled, setWaterButtonDisabled] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customDrinks, setCustomDrinks] = useState<Array<{name: string, emoji?: string, bgColor?: string, alcoholPercentage: number}>>([]);
  const { settings, saveSettings } = useSettings();
  const { toast } = useToast();

  const drinkPoints: Record<string, number> = {
    beer: 5,
    wine: 12,
    spirits: 40,
    water: -5, // Negative points to reduce tipsy level
    custom: 0 // Custom drinks use their own percentage
  };

  // Initialize a new session when component loads
  useEffect(() => {
    async function createNewSession() {
      try {
        const id = uuidv4();
        setSessionId(id);

        // Create a new session in the database
        await apiRequest("POST", "/api/sessions", {
          id,
          totalPoints: 0,
          hasMixedDrinks: false
        });
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    }

    createNewSession();
  }, []);

  // Save drink to database and update with returned ID
  const saveDrink = async (drink: Drink, index: number) => {
    if (!sessionId) return;

    try {
      const drinkData = {
        sessionId,
        type: drink.type,
        amount: drink.amount,
        points: drink.points
      };

      const response = await apiRequest("POST", "/api/drinks", drinkData);
      const savedDrink = await response.json();

      // Update the drink in our local state with the ID from the database
      const updatedDrinks = [...drinks];
      updatedDrinks[index] = {
        ...drink,
        id: savedDrink.id
      };

      setDrinks(updatedDrinks);
      return savedDrink;
    } catch (error) {
      console.error("Failed to save drink:", error);
      return null;
    }
  };

  // Update session when points change
  const updateSession = async () => {
    if (!sessionId) return;

    // Calculate adjusted points (20% increase when mixing drinks)
    const adjustedPoints = hasMixedDrinks ? Math.round(totalPoints * 1.2) : totalPoints;

    try {
      await apiRequest("PUT", `/api/sessions/${sessionId}`, {
        totalPoints: adjustedPoints, // Store the adjusted points in the database
        hasMixedDrinks
      });
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  const handleAddDrink = async (drinkType: DrinkType, amount: number, customName?: string, customEmoji?: string, customPercentage?: number) => {
    // Accept disclaimer when any button is clicked
    if (!disclaimerAccepted) {
      setDisclaimerAccepted(true);
    }
    // Special handling for water
    if (drinkType === 'water') {
      if (!canDrinkWater()) {
        toast({
          title: "Water limit reached",
          description: "You can only have 2 water drinks per hour to reduce your tipsy level.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const now = new Date();
      setWaterTimestamps(prev => [...prev, now]);

      // Water reduces tipsy level by 10 points
      const waterPoints = -10;
      const newTotalPoints = Math.max(0, totalPoints + waterPoints);
      setTotalPoints(newTotalPoints);

      // Create water drink and save to database
      const waterDrink: Drink = {
        type: 'water',
        amount: 1,
        points: waterPoints
      };

      const updatedDrinks = [...drinks, waterDrink];
      setDrinks(updatedDrinks);

      // Save the drink to the database
      await saveDrink(waterDrink, updatedDrinks.length - 1);

      // Check if we need to disable the water button (reached 2 per hour)
      if (!canDrinkWater()) {
        setWaterButtonDisabled(true);

        // Enable the button after an hour
        setTimeout(() => {
          setWaterButtonDisabled(false);
        }, 60 * 60 * 1000);
      }

      toast({
        title: "Water added!",
        description: "Great job staying hydrated! Your tipsy level has been reduced.",
        duration: 3000,
      });

      // Update session in database
      await updateSession();
      return;
    }

    // For decreasing drinks (negative amounts)
    if (amount < 0) {
      // Just update the total points
      let points;
      if (customPercentage) {
        // Use custom percentage for decreasing custom drinks too
        points = Math.round(customPercentage * amount / 100 * 100);
      } else {
        // Use standard points for standard drinks
        points = Math.round((drinkPoints[drinkType] || 0) * amount);
      }
      setTotalPoints(prev => prev + points); // points will be negative here
      return;
    }

    // For adding drinks (positive amounts)
    if (amount <= 0) return;

    // Calculate points
    let points;
    
    if (customPercentage) {
      // For custom drinks: alcohol% * amount in dl / 100 (to get percentage as decimal) * 100 (to match standard points)
      points = Math.round(customPercentage * amount / 100 * 100); 
    } else {
      // For standard drinks
      points = Math.round((drinkPoints[drinkType] || 0) * amount);
    }

    const newDrink: Drink = {
      type: drinkType,
      amount,
      points,
      customName,
      customEmoji,
      customPercentage
    };

    const updatedDrinks = [...drinks, newDrink];
    setDrinks(updatedDrinks);

    const newTotalPoints = totalPoints + points;
    setTotalPoints(newTotalPoints);

    // Check if mixed drinks
    const uniqueDrinkTypes = new Set(updatedDrinks.map(d => d.type));
    const newMixedDrinks = uniqueDrinkTypes.size > 1;
    setHasMixedDrinks(newMixedDrinks);

    // Save the drink to the database (it's the last one in the array)
    await saveDrink(newDrink, updatedDrinks.length - 1);

    // Show tip about drinking water
    toast({
      title: "Drink added!",
      description: "Remember to drink a glass of water to stay hydrated.",
      duration: 3000,
    });

    // Show warning about mixed drinks if this is the first time mixing
    if (newMixedDrinks && !hasMixedDrinks) {
      toast({
        title: "Mixed drinks warning",
        description: "Mixing different types of drinks increases your tipsy level by 20%.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleRemoveDrink = async (index: number) => {
    const updatedDrinks = [...drinks];
    const removedDrink = updatedDrinks[index];

    // Remove from database if drink has an ID
    if (removedDrink.id) {
      try {
        await apiRequest("DELETE", `/api/drinks/${removedDrink.id}`);
      } catch (error) {
        console.error("Failed to remove drink from database:", error);
      }
    }

    // Remove from state
    updatedDrinks.splice(index, 1);
    setDrinks(updatedDrinks);
    setTotalPoints(prev => prev - removedDrink.points);

    // Check if still has mixed drinks
    const uniqueDrinkTypes = new Set(updatedDrinks.map(d => d.type));
    const newMixedDrinks = uniqueDrinkTypes.size > 1;
    setHasMixedDrinks(newMixedDrinks);

    // Update session with new point total
    if (newMixedDrinks !== hasMixedDrinks || updatedDrinks.length === 0) {
      await updateSession();
    }
  };

  // Update session whenever points change
  useEffect(() => {
    // Don't update on initial render with 0 points
    if (totalPoints > 0 || (totalPoints === 0 && drinks.length > 0)) {
      updateSession();
    }
  }, [totalPoints, hasMixedDrinks]);

  // Check if user can drink water (limit to 2 per hour)
  const canDrinkWater = () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Filter water timestamps from the last hour
    const recentWaterDrinks = waterTimestamps.filter(timestamp => 
      timestamp > oneHourAgo
    );

    return recentWaterDrinks.length < 2;
  };

  // Handle water through the regular addDrink function
  // Water processing is now integrated into handleAddDrink

  const handleReset = async () => {
    // Create a new session
    const id = uuidv4();
    setSessionId(id);

    try {
      // Create a new session in the database
      await apiRequest("POST", "/api/sessions", {
        id,
        totalPoints: 0,
        hasMixedDrinks: false
      });

      // Reset state
      setDrinks([]);
      setTotalPoints(0);
      setHasMixedDrinks(false);
      setShowResults(true); // Keep results view open with 0 points
      setWaterTimestamps([]);
      setWaterButtonDisabled(false);
    } catch (error) {
      console.error("Failed to create new session:", error);
    }
  };

  const tipsyLevel = calculateTipsyLevel(totalPoints, {
    tipsyThreshold: settings.tipsyThreshold,
    drunkThreshold: settings.drunkThreshold
  });

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return; // Dropped outside the list

    const { source, destination } = result;

    if (source.index === destination.index) return; // No change

    // Reorder the drinks array
    const newDrinks = Array.from(drinks);
    const [movedDrink] = newDrinks.splice(source.index, 1);
    newDrinks.splice(destination.index, 0, movedDrink);

    setDrinks(newDrinks);

    // Show a toast to confirm the reordering
    toast({
      title: "Drinks reordered",
      description: "The order of your drinks has been updated.",
      duration: 2000,
    });
  };

  // Handle settings save
  const handleSaveSettings = (newSettings: AppSettings) => {
    saveSettings(newSettings);
    toast({
      title: "Settings saved",
      description: "Your custom settings have been applied.",
      duration: 3000,
    });
  };

  // Handle adding a custom drink
  const handleAddCustomDrink = async (customDrink: Omit<Drink, "id" | "sessionId"> & { name: string, emoji?: string, bgColor?: string, alcoholPercentage: number }) => {
    if (customDrink.points <= 0) {
      toast({
        title: "Invalid drink",
        description: "The drink must have a positive amount of alcohol.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Only add the custom drink to the custom drinks list without affecting history
    const newCustomDrink = {
      name: customDrink.name,
      emoji: customDrink.emoji || "🥃",
      bgColor: customDrink.bgColor || "bg-blue-100",
      alcoholPercentage: customDrink.alcoholPercentage
    };
    
    setCustomDrinks(prev => [...prev, newCustomDrink]);

    // Show success toast
    toast({
      title: "Custom drink added!",
      description: `Added ${customDrink.name} to your drink options.`,
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col min-h-full relative">
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={settings}
        onAddCustomDrink={handleAddCustomDrink}
      />

      

      {/* Header with disclaimer and settings */}
      <div className="mb-4">
        {!disclaimerAccepted && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            <p className="text-xs text-red-700">
              <strong>Disclaimer:</strong> Portfolio project for fun only. Results are fictional. Never drink & drive. 18+ only. Click any button to accept.
            </p>
          </div>
        )}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Top section with drink selector */}
      <div className="mb-4">
        <DrinkSelector 
          onAddDrink={handleAddDrink}
          customDrinks={customDrinks}
          progressBarWidth={Math.min(100, (totalPoints / 100) * 100)}
          displayTipsyLevel={calculateTipsyLevel(totalPoints)}
        />
      </div>

      {/* Middle section with drinks list */}
      <div className="mb-4">
        {drinks.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <DrinksList
              drinks={drinks}
              totalPoints={totalPoints}
              onRemoveDrink={handleRemoveDrink}
              progressBarWidth={Math.min(100, (totalPoints / 100) * 100)}
              displayTipsyLevel={calculateTipsyLevel(totalPoints)}
            />
          </DragDropContext>
        )}
      </div>

      {/* Results section */}
      {showResults && (
        <div className="mb-4">
          <TipsyResult
            tipsyLevel={tipsyLevel}
            totalPoints={totalPoints}
            hasMixedDrinks={hasMixedDrinks}
          />
          <SocialActions 
            tipsyPoints={totalPoints} 
            showShareOptions={totalPoints > settings.tipsyThreshold} // Only show when tipsy or drunk
          />
        </div>
      )}

      {/* Fixed bottom section with reset button */}
      <div className="mt-auto">
        <Button 
          variant="outline" 
          className="w-full py-4" 
          onClick={handleReset}
        >
          Reset Session
        </Button>
      </div>
    </div>
  );
}