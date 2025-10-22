import type { ZodiacProfile } from "@shared/schema";
import { zodiacData } from "./zodiac-data";

export function calculateZodiacProfile(birthDate: string, birthTime?: string): ZodiacProfile {
  // Handle different date formats
  let date: Date;
  
  // Try parsing DD/MM/YYYY format first
  if (birthDate.includes('/')) {
    const [day, month, year] = birthDate.split('/').map(num => parseInt(num, 10));
    date = new Date(year, month - 1, day); // Month is 0-indexed in JS
  } else {
    // Try standard ISO format or other parseable formats
    date = new Date(birthDate);
  }
  
  // Validate the date
  if (isNaN(date.getTime())) {
    throw new Error('Invalid birth date format. Please use DD/MM/YYYY or YYYY-MM-DD format.');
  }
  
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed
  const day = date.getDate();
  const year = date.getFullYear();

  // Western Zodiac calculation
  const western = calculateWesternZodiac(month, day);
  
  // Chinese Zodiac calculation
  const chinese = calculateChineseZodiac(year);
  
  // Vedic Astrology calculation (simplified)
  const vedic = calculateVedicSign(month, day);
  
  // Mayan Zodiac calculation
  const mayan = calculateMayanSign(month, day);
  
  // Celtic Zodiac calculation
  const celtic = calculateCelticSign(month, day);
  
  // Arabic Zodiac calculation (28 Lunar Mansions)
  const arabic = calculateArabicSign(month, day, year);

  // Generate unified themes and integration opportunities
  const unifiedThemes = generateUnifiedThemes(western, chinese, vedic, mayan, celtic);
  const integrationOpportunities = generateIntegrationOpportunities(western, chinese, vedic, mayan, celtic);

  return {
    western,
    chinese,
    vedic,
    mayan,
    celtic,
    arabic,
    unifiedThemes,
    integrationOpportunities,
  };
}

function calculateWesternZodiac(month: number, day: number) {
  const signs = zodiacData.western;
  
  // Simplified date-based calculation for Western zodiac
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return signs[0]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return signs[1]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return signs[2]; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return signs[3]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return signs[4]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return signs[5]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return signs[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return signs[7]; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return signs[8]; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return signs[9]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return signs[10]; // Aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return signs[11]; // Pisces
  
  return signs[0]; // Fallback to Aries
}

function calculateChineseZodiac(year: number) {
  const animals = zodiacData.chinese.animals;
  const elements = zodiacData.chinese.elements;
  
  // Chinese zodiac starts from 1924 for this calculation
  const baseYear = 1924;
  const animalIndex = (year - baseYear) % 12;
  const elementIndex = Math.floor((year - baseYear) % 10 / 2);
  
  const animal = animals[animalIndex];
  const element = elements[elementIndex];
  
  return {
    animal: animal.name,
    element: element.name,
    year,
    traits: animal.traits,
    characteristics: animal.characteristics,
    description: animal.description,
    elementDescription: element.description,
  };
}

function calculateVedicSign(month: number, day: number) {
  const nakshatras = zodiacData.vedic;
  
  // Simplified calculation based on date ranges
  const totalDays = (month - 1) * 30 + day; // Approximation
  const nakshatraIndex = Math.floor((totalDays - 1) / 13.5) % 27;
  
  // Ensure we have a valid index and the nakshatra exists
  const index = Math.max(0, Math.min(Math.floor(nakshatraIndex), nakshatras.length - 1));
  return nakshatras[index] || nakshatras[0];
}

function calculateMayanSign(month: number, day: number) {
  const signs = zodiacData.mayan;
  
  // Simplified calculation based on available signs
  const totalDays = (month - 1) * 30 + day;
  const signIndex = (totalDays - 1) % signs.length;
  
  return signs[signIndex] || signs[0]; // Fallback to first sign if undefined
}

function calculateCelticSign(month: number, day: number) {
  const trees = zodiacData.celtic;
  
  // Celtic tree calculation based on date ranges
  if ((month === 12 && day >= 24) || (month === 1 && day <= 20)) return trees[0]; // Birch
  if ((month === 1 && day >= 21) || (month === 2 && day <= 17)) return trees[1]; // Rowan
  if ((month === 2 && day >= 18) || (month === 3 && day <= 17)) return trees[2]; // Ash
  if ((month === 3 && day >= 18) || (month === 4 && day <= 14)) return trees[3]; // Alder
  if ((month === 4 && day >= 15) || (month === 5 && day <= 12)) return trees[4]; // Willow
  if ((month === 5 && day >= 13) || (month === 6 && day <= 9)) return trees[5]; // Hawthorn
  if ((month === 6 && day >= 10) || (month === 7 && day <= 7)) return trees[6]; // Oak
  if ((month === 7 && day >= 8) || (month === 8 && day <= 4)) return trees[7]; // Holly
  if ((month === 8 && day >= 5) || (month === 9 && day <= 1)) return trees[8]; // Hazel
  if ((month === 9 && day >= 2) || (month === 9 && day <= 29)) return trees[9]; // Vine
  if ((month === 9 && day >= 30) || (month === 10 && day <= 27)) return trees[10]; // Ivy
  if ((month === 10 && day >= 28) || (month === 11 && day <= 24)) return trees[11]; // Reed
  if ((month === 11 && day >= 25) || (month === 12 && day <= 23)) return trees[12]; // Elder
  
  return trees[0]; // Fallback to Birch
}

function calculateArabicSign(month: number, day: number, year: number) {
  const mansions = zodiacData.arabic;
  
  // Use UTC to avoid DST timezone shifts
  const birthDateUTC = Date.UTC(year, month - 1, day);
  const yearStartUTC = Date.UTC(year, 0, 1);
  
  // Calculate day of year using UTC (immune to DST)
  const dayOfYear = Math.floor((birthDateUTC - yearStartUTC) / (1000 * 60 * 60 * 24)) + 1;
  
  // March 21 is the tropical Aries 0° point
  const marchStartUTC = Date.UTC(year, 2, 21); // Month 2 = March (0-indexed)
  const ariesDayOfYear = Math.floor((marchStartUTC - yearStartUTC) / (1000 * 60 * 60 * 24)) + 1;
  
  // Determine if the year is a leap year
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInYear = isLeapYear ? 366 : 365;
  
  // Adjust day of year to start from Aries 0° (March 21)
  let adjustedDay = dayOfYear - ariesDayOfYear;
  if (adjustedDay < 0) {
    // Handle dates before March 21 (wrap to previous year's cycle)
    adjustedDay += daysInYear;
  }
  
  // Convert day to tropical longitude (360° / 365.25 days ≈ 0.9856° per day)
  const tropicalLongitude = (adjustedDay * 360) / 365.25;
  
  // Each mansion covers exactly 12° 51' 26" = 12.857142857° (360° / 28)
  const mansionDegrees = 360 / 28;
  const mansionIndex = Math.floor(tropicalLongitude / mansionDegrees) % 28;
  
  return mansions[mansionIndex] || mansions[0]; // Fallback to first mansion
}

function generateUnifiedThemes(western: any, chinese: any, vedic: any, mayan: any, celtic: any): string[] {
  return [
    "Compassion: All systems highlight your deep empathy and healing nature",
    "Growth: Natural ability to nurture others and help them evolve", 
    "Intuition: Consistent psychic and spiritual gifts across traditions",
    "Connection: Strong ability to bridge different worlds and perspectives"
  ];
}

function generateIntegrationOpportunities(western: any, chinese: any, vedic: any, mayan: any, celtic: any): string[] {
  return [
    "Balance: Use elemental flexibility to set healthy boundaries",
    "Protection: Apply spiritual warrior energy to defend your sensitive nature",
    "Timing: Honor lunar wisdom in your spiritual practices",
    "Wisdom: Integrate ancient knowledge with modern understanding"
  ];
}
