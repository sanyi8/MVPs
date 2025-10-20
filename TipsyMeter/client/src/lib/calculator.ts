import { TipsyLevel } from "@/types";

export interface ThresholdSettings {
  tipsyThreshold: number;
  drunkThreshold: number;
}

export function calculateTipsyLevel(
  points: number, 
  thresholds: ThresholdSettings = { tipsyThreshold: 40, drunkThreshold: 60 }
): TipsyLevel {
  // Ensure thresholds are in correct order (tipsy lower than drunk)
  const correctedThresholds = {
    tipsyThreshold: Math.min(thresholds.tipsyThreshold, thresholds.drunkThreshold - 5),
    drunkThreshold: Math.max(thresholds.drunkThreshold, thresholds.tipsyThreshold + 5)
  };

  if (points >= correctedThresholds.drunkThreshold) {
    return {
      text: "Drunk",
      barColor: "bg-red-500",
      message: "You should stop drinking and consider getting a ride home."
    };
  } else if (points >= correctedThresholds.tipsyThreshold) {
    return {
      text: "Tipsy",
      barColor: "bg-amber-500",
      message: "You're getting tipsy. Consider slowing down and having some water.",
      level: points.toFixed(1) // Added tipsy level with one decimal place
    };
  } else {
    return {
      text: "All Good",
      barColor: "bg-emerald-500",
      message: "You're doing great! Have fun and stay safe!",
      level: points.toFixed(1) // Added tipsy level with one decimal place

    };
  }
}

// Drink points values per dl
export const DRINK_POINTS = {
  beer: 5,     // 5dl = 25 points
  wine: 12,    // 2dl = 24 points
  spirits: 40, // 0.5dl = 20 points
  water: -5    // 2dl = -10 points (helps reduce tipsy level)
};