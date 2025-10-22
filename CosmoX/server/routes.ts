import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema } from "@shared/schema";
import { calculateZodiacProfile } from "../client/src/lib/zodiac-calculator";
import { generateDailyInsights, generateCompatibilityAdvice } from "./gemini";
import type { ZodiacProfile } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validatedData);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get a profile by ID
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const profile = await storage.getProfile(id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate zodiac profile
  app.post("/api/zodiac-profile", async (req, res) => {
    try {
      const { birthDate, birthTime } = req.body;
      if (!birthDate) {
        return res.status(400).json({ message: "Birth date is required" });
      }

      const zodiacProfile = calculateZodiacProfile(birthDate, birthTime);
      res.json(zodiacProfile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate daily insights using Gemini AI
  app.post("/api/daily-insights", async (req, res) => {
    try {
      const { zodiacProfile } = req.body;

      if (!zodiacProfile) {
        return res.status(400).json({ message: "Zodiac profile is required" });
      }

      const insights = await generateDailyInsights(zodiacProfile);
      res.json(insights);
    } catch (error: any) {
      console.error("Error generating daily insights:", error);
      res.status(500).json({ message: "Failed to generate daily insights" });
    }
  });

  // Generate compatibility advice using Gemini AI
  app.post("/api/compatibility-advice", async (req, res) => {
    try {
      const { userZodiac, partnerZodiac, compatibilityScore } = req.body;

      if (!userZodiac || !partnerZodiac || typeof compatibilityScore !== 'number') {
        return res.status(400).json({ message: "User zodiac, partner zodiac, and compatibility score are required" });
      }

      const advice = await generateCompatibilityAdvice(userZodiac, partnerZodiac, compatibilityScore);
      res.json({ advice });
    } catch (error: any) {
      console.error("Error generating compatibility advice:", error);
      res.status(500).json({ message: "Failed to generate compatibility advice" });
    }
  });

  // Generate cross-system insights using Gemini AI
  app.post("/api/cross-system-insights", async (req, res) => {
    try {
      const { zodiacProfile, selectedSystems } = req.body;

      if (!zodiacProfile || !selectedSystems) {
        return res.status(400).json({ message: "Zodiac profile and selected systems are required" });
      }

      const { generateCrossSystemInsights } = await import('./gemini.js');
      const insights = await generateCrossSystemInsights(zodiacProfile, selectedSystems);
      res.json(insights);
    } catch (error: any) {
      console.error("Error generating cross-system insights:", error);
      res.status(500).json({ message: "Failed to generate cross-system insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}