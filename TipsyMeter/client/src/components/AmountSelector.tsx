import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DrinkType } from "@/types";

const COMMON_AMOUNTS = {
  beer: [
    { label: "One glass (5 dl)", value: 5 },
    { label: "Half pint (2.5 dl)", value: 2.5 },
    { label: "Small glass (3.3 dl)", value: 3.3 }
  ],
  wine: [
    { label: "Standard glass (2 dl)", value: 2 },
    { label: "Small glass (1.5 dl)", value: 1.5 },
    { label: "Large glass (2.5 dl)", value: 2.5 }
  ],
  spirits: [
    { label: "Shot (0.5 dl)", value: 0.5 },
    { label: "Double (1 dl)", value: 1 },
    { label: "Drink (0.2 dl)", value: 0.2 }
  ]
};

const DRINK_LABELS = {
  beer: "beer",
  wine: "wine",
  spirits: "spirits"
};

interface AmountSelectorProps {
  drinkType: DrinkType;
  onCancel: () => void;
  onAddDrink: (amount: number) => void;
}

export default function AmountSelector({ 
  drinkType, 
  onCancel, 
  onAddDrink 
}: AmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState(1);
  
  const handleCommonAmountClick = (amount: number) => {
    setCustomAmount(amount);
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(parseFloat(e.target.value));
  };
  
  const handleAddClick = () => {
    if (customAmount > 0) {
      onAddDrink(customAmount);
    }
  };
  
  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-medium mb-2">
        How much {DRINK_LABELS[drinkType]} did you have?
      </h3>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {COMMON_AMOUNTS[drinkType].map((amount, index) => (
          <button
            key={index}
            className="px-3 py-1 bg-blue-100 rounded-md text-sm hover:bg-blue-200"
            onClick={() => handleCommonAmountClick(amount.value)}
          >
            {amount.label}
          </button>
        ))}
      </div>
      
      <div className="flex items-center mt-3">
        <label htmlFor="customAmount" className="text-sm mr-3">
          Custom amount (dl):
        </label>
        <Input
          id="customAmount"
          type="number"
          min="0.1"
          step="0.1"
          value={customAmount}
          onChange={handleCustomAmountChange}
          className="w-20 text-center"
        />
      </div>
      
      <div className="flex space-x-3 mt-4">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleAddClick}>
          Add Drink
        </Button>
      </div>
    </div>
  );
}
