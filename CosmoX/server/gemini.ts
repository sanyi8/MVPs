import { GoogleGenAI } from "@google/genai";
import type { ZodiacProfile } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DailyInsight {
  morningFocus: string;
  afternoonEnergy: string;
  eveningReflection: string;
  luckyColor: string;
  cosmicAdvice: string;
  energyLevel: number;
}

export async function generateDailyInsights(zodiacProfile: ZodiacProfile): Promise<DailyInsight> {
  try {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const systemPrompt = `You are an expert astrologer who creates personalized daily insights. 
Generate daily cosmic guidance based on the provided zodiac profile.
Keep insights positive, actionable, and specific to today's energy.
Respond with JSON in this exact format:
{
  "morningFocus": "short actionable morning guidance (max 60 chars)",
  "afternoonEnergy": "short afternoon activity suggestion (max 60 chars)", 
  "eveningReflection": "short evening reflection prompt (max 60 chars)",
  "luckyColor": "single color name",
  "cosmicAdvice": "motivational daily mantra (max 80 chars)",
  "energyLevel": number between 60-95
}`;

    const userPrompt = `Today is ${today}. Create personalized daily insights for:

Western Sign: ${zodiacProfile.western.sign} (${zodiacProfile.western.element})
Chinese Animal: ${zodiacProfile.chinese.animal} (${zodiacProfile.chinese.element})
Vedic Nakshatra: ${zodiacProfile.vedic.nakshatra}
Mayan Sign: ${zodiacProfile.mayan.daySign}
Celtic Tree: ${zodiacProfile.celtic.tree}

Key traits: ${zodiacProfile.western.traits.join(', ')}
Strengths: ${zodiacProfile.western.strengths.join(', ')}
Unified themes: ${zodiacProfile.unifiedThemes.join(', ')}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            morningFocus: { type: "string" },
            afternoonEnergy: { type: "string" },
            eveningReflection: { type: "string" },
            luckyColor: { type: "string" },
            cosmicAdvice: { type: "string" },
            energyLevel: { type: "number" }
          },
          required: ["morningFocus", "afternoonEnergy", "eveningReflection", "luckyColor", "cosmicAdvice", "energyLevel"]
        }
      },
      contents: userPrompt
    });

    const rawJson = response.text;
    if (rawJson) {
      const insights: DailyInsight = JSON.parse(rawJson);
      return insights;
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Error generating daily insights:", error);
    // Fallback insights
    return {
      morningFocus: "Channel your cosmic energy into creative projects",
      afternoonEnergy: "Perfect time for important conversations",
      eveningReflection: "Meditate on tomorrow's possibilities",
      luckyColor: "purple",
      cosmicAdvice: "Trust your intuition and embrace positive change",
      energyLevel: 75
    };
  }
}

export async function generateCompatibilityAdvice(
  userZodiac: ZodiacProfile,
  partnerZodiac: ZodiacProfile,
  compatibilityScore: number
): Promise<string[]> {
  try {
    const systemPrompt = `You are an expert relationship astrologer. 
Generate specific compatibility advice based on zodiac profiles and compatibility score.
Respond with JSON array of exactly 4 insights as strings (max 100 chars each).`;

    const userPrompt = `Create compatibility advice for:
Person 1: ${userZodiac.western.sign} (${userZodiac.chinese.animal})
Person 2: ${partnerZodiac.western.sign} (${partnerZodiac.chinese.animal})
Compatibility Score: ${compatibilityScore}%

Focus on communication, emotional connection, shared values, and growth opportunities.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: { type: "string" }
        }
      },
      contents: userPrompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Error generating compatibility advice:", error);
    return [
      "Focus on open communication to strengthen your connection",
      "Appreciate each other's unique cosmic energies and differences", 
      "Create shared rituals that honor both your spiritual paths",
      "Practice patience and understanding during challenging times"
    ];
  }
}

export async function generateCrossSystemInsights(
  zodiacProfile: ZodiacProfile,
  selectedSystems: string[]
): Promise<{ unifiedThemes: string[]; integrationOpportunities: string[] }> {
  try {
    const systemPrompt = `You are an expert multi-cultural astrologer.
Generate unified themes and integration opportunities based on selected zodiac systems.
Respond with JSON in this exact format:
{
  "unifiedThemes": ["theme1", "theme2", "theme3"],
  "integrationOpportunities": ["opportunity1", "opportunity2", "opportunity3"]
}
Each item should be max 80 characters.`;

    const activeSystems = selectedSystems.map(sys => {
      switch(sys) {
        case 'western': return `Western: ${zodiacProfile.western.sign} (${zodiacProfile.western.element})`;
        case 'chinese': return `Chinese: ${zodiacProfile.chinese.animal} (${zodiacProfile.chinese.element})`;
        case 'vedic': return `Vedic: ${zodiacProfile.vedic.nakshatra}`;
        case 'mayan': return `Mayan: ${zodiacProfile.mayan.daySign}`;
        case 'celtic': return `Celtic: ${zodiacProfile.celtic.tree}`;
        default: return '';
      }
    }).filter(Boolean);

    const userPrompt = `Generate cross-system insights for these active zodiac systems:
${activeSystems.join('\n')}

Focus on commonalities, complementary energies, and how to integrate wisdom from these traditions.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            unifiedThemes: { type: "array", items: { type: "string" } },
            integrationOpportunities: { type: "array", items: { type: "string" } }
          },
          required: ["unifiedThemes", "integrationOpportunities"]
        }
      },
      contents: userPrompt
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Error generating cross-system insights:", error);
    return {
      unifiedThemes: zodiacProfile.unifiedThemes,
      integrationOpportunities: zodiacProfile.integrationOpportunities
    };
  }
}