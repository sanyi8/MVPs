import type { ZodiacProfile } from "@shared/schema";

export interface CompatibilityMatch {
  sign: string;
  system: "western" | "chinese" | "vedic" | "mayan" | "celtic";
  score: number;
  relationship: "excellent" | "good" | "challenging" | "complex";
  description: string;
  advice: string;
}

export interface RelationshipInsights {
  bestMatches: CompatibilityMatch[];
  challengingMatches: CompatibilityMatch[];
  empoweringConnections: string[];
  growthOpportunities: string[];
  communicationTips: string[];
}

export function calculateCompatibility(zodiacProfile: ZodiacProfile): RelationshipInsights {
  const bestMatches: CompatibilityMatch[] = [];
  const challengingMatches: CompatibilityMatch[] = [];

  // Western zodiac compatibility
  const westernMatches = getWesternCompatibility(zodiacProfile.western.sign);
  bestMatches.push(...westernMatches.best);
  challengingMatches.push(...westernMatches.challenging);

  // Chinese zodiac compatibility  
  const chineseMatches = getChineseCompatibility(zodiacProfile.chinese.animal);
  bestMatches.push(...chineseMatches.best);
  challengingMatches.push(...chineseMatches.challenging);

  // Vedic compatibility
  const vedicMatches = getVedicCompatibility(zodiacProfile.vedic.nakshatra);
  bestMatches.push(...vedicMatches.best);
  challengingMatches.push(...vedicMatches.challenging);

  const empoweringConnections = generateEmpoweringConnections(zodiacProfile);
  const growthOpportunities = generateGrowthOpportunities(zodiacProfile);
  const communicationTips = generateCommunicationTips(zodiacProfile);

  return {
    bestMatches: bestMatches.slice(0, 6), // Top 6 matches
    challengingMatches: challengingMatches.slice(0, 4), // Top 4 challenging
    empoweringConnections,
    growthOpportunities,
    communicationTips
  };
}

function getWesternCompatibility(sign: string) {
  const compatibility: Record<string, { best: string[]; challenging: string[] }> = {
    "Aries": {
      best: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
      challenging: ["Cancer", "Capricorn"]
    },
    "Taurus": {
      best: ["Virgo", "Capricorn", "Cancer", "Pisces"],
      challenging: ["Leo", "Aquarius"]
    },
    "Gemini": {
      best: ["Libra", "Aquarius", "Aries", "Leo"],
      challenging: ["Virgo", "Pisces"]
    },
    "Cancer": {
      best: ["Scorpio", "Pisces", "Taurus", "Virgo"],
      challenging: ["Aries", "Libra"]
    },
    "Leo": {
      best: ["Aries", "Sagittarius", "Gemini", "Libra"],
      challenging: ["Taurus", "Scorpio"]
    },
    "Virgo": {
      best: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
      challenging: ["Gemini", "Sagittarius"]
    },
    "Libra": {
      best: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
      challenging: ["Cancer", "Capricorn"]
    },
    "Scorpio": {
      best: ["Cancer", "Pisces", "Virgo", "Capricorn"],
      challenging: ["Leo", "Aquarius"]
    },
    "Sagittarius": {
      best: ["Aries", "Leo", "Libra", "Aquarius"],
      challenging: ["Virgo", "Pisces"]
    },
    "Capricorn": {
      best: ["Taurus", "Virgo", "Scorpio", "Pisces"],
      challenging: ["Aries", "Libra"]
    },
    "Aquarius": {
      best: ["Gemini", "Libra", "Aries", "Sagittarius"],
      challenging: ["Taurus", "Scorpio"]
    },
    "Pisces": {
      best: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
      challenging: ["Gemini", "Sagittarius"]
    }
  };

  const matches = compatibility[sign] || { best: [], challenging: [] };
  
  return {
    best: matches.best.map(matchSign => ({
      sign: matchSign,
      system: "western" as const,
      score: 85 + Math.random() * 10,
      relationship: "excellent" as const,
      description: `${matchSign} harmonizes beautifully with your ${sign} energy, creating natural understanding and mutual support.`,
      advice: `Embrace shared adventures and creative projects. Your energies complement each other naturally.`
    })),
    challenging: matches.challenging.map(matchSign => ({
      sign: matchSign,
      system: "western" as const,
      score: 35 + Math.random() * 20,
      relationship: "challenging" as const,
      description: `${matchSign} may present growth challenges for your ${sign} nature, requiring extra understanding and patience.`,
      advice: `Focus on finding common ground and appreciating different perspectives. Growth happens through understanding differences.`
    }))
  };
}

function getChineseCompatibility(animal: string) {
  const compatibility: Record<string, { best: string[]; challenging: string[] }> = {
    "Rat": { best: ["Dragon", "Monkey"], challenging: ["Horse", "Rooster"] },
    "Ox": { best: ["Snake", "Rooster"], challenging: ["Sheep", "Horse"] },
    "Tiger": { best: ["Horse", "Dog"], challenging: ["Monkey", "Snake"] },
    "Rabbit": { best: ["Sheep", "Pig"], challenging: ["Rooster", "Dragon"] },
    "Dragon": { best: ["Rat", "Monkey"], challenging: ["Dog", "Rabbit"] },
    "Snake": { best: ["Ox", "Rooster"], challenging: ["Pig", "Tiger"] },
    "Horse": { best: ["Tiger", "Dog"], challenging: ["Rat", "Ox"] },
    "Sheep": { best: ["Rabbit", "Pig"], challenging: ["Ox", "Dog"] },
    "Monkey": { best: ["Rat", "Dragon"], challenging: ["Tiger", "Pig"] },
    "Rooster": { best: ["Ox", "Snake"], challenging: ["Rabbit", "Dog"] },
    "Dog": { best: ["Tiger", "Horse"], challenging: ["Dragon", "Sheep"] },
    "Pig": { best: ["Rabbit", "Sheep"], challenging: ["Snake", "Monkey"] }
  };

  const matches = compatibility[animal] || { best: [], challenging: [] };
  
  return {
    best: matches.best.map(matchAnimal => ({
      sign: matchAnimal,
      system: "chinese" as const,
      score: 80 + Math.random() * 15,
      relationship: "good" as const,
      description: `${matchAnimal} and ${animal} share complementary energies and life approaches.`,
      advice: `Build on shared values and support each other's natural strengths.`
    })),
    challenging: matches.challenging.map(matchAnimal => ({
      sign: matchAnimal,
      system: "chinese" as const,
      score: 25 + Math.random() * 25,
      relationship: "complex" as const,
      description: `${matchAnimal} may clash with ${animal} energy patterns, requiring conscious effort to harmonize.`,
      advice: `Practice patience and seek to understand different timing and approaches to life.`
    }))
  };
}

function getVedicCompatibility(nakshatra: string) {
  // Simplified Vedic compatibility based on nakshatra families
  const compatibleNakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha"
  ];
  
  const bestMatch = compatibleNakshatras[Math.floor(Math.random() * compatibleNakshatras.length)];
  const challengingMatch = compatibleNakshatras[Math.floor(Math.random() * compatibleNakshatras.length)];
  
  return {
    best: [{
      sign: bestMatch,
      system: "vedic" as const,
      score: 75 + Math.random() * 20,
      relationship: "good" as const,
      description: `${bestMatch} nakshatra creates harmonious spiritual and emotional connections with ${nakshatra}.`,
      advice: `Focus on shared spiritual growth and emotional understanding.`
    }],
    challenging: [{
      sign: challengingMatch,
      system: "vedic" as const,
      score: 30 + Math.random() * 30,
      relationship: "challenging" as const,
      description: `${challengingMatch} may present karmic lessons and growth opportunities for ${nakshatra}.`,
      advice: `Approach with compassion and see challenges as opportunities for spiritual growth.`
    }]
  };
}

function generateEmpoweringConnections(zodiacProfile: ZodiacProfile): string[] {
  return [
    `Fire signs (Aries, Leo, Sagittarius) boost your ${zodiacProfile.western.sign} confidence and motivation`,
    `${zodiacProfile.chinese.element} element people share your life rhythm and energy patterns`,
    `Fellow ${zodiacProfile.vedic.moonSign} moon signs provide emotional understanding and support`,
    `People with strong ${zodiacProfile.western.element} energy amplify your natural strengths`,
    `Those who appreciate ${zodiacProfile.celtic.tree} tree wisdom can mentor your spiritual growth`
  ];
}

function generateGrowthOpportunities(zodiacProfile: ZodiacProfile): string[] {
  return [
    `Earth signs can help ground your ${zodiacProfile.western.sign} energy and provide practical wisdom`,
    `Water signs offer emotional depth to balance your natural tendencies`,
    `Air signs bring new perspectives and intellectual stimulation to your worldview`,
    `Opposite zodiac signs challenge you to develop complementary qualities`,
    `Different cultural zodiac systems expand your understanding of personality and relationships`
  ];
}

function generateCommunicationTips(zodiacProfile: ZodiacProfile): string[] {
  return [
    `With Fire signs: Be direct and enthusiastic, match their energy and passion`,
    `With Earth signs: Be practical and reliable, show concrete examples and plans`,
    `With Air signs: Engage intellectually, discuss ideas and possibilities openly`,
    `With Water signs: Lead with emotions, create safe spaces for deeper sharing`,
    `Remember your ${zodiacProfile.western.sign} communication style and adapt when needed`
  ];
}