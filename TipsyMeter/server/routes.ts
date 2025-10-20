import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSessionSchema, insertDrinkSchema } from '@shared/schema';
import { z } from 'zod';

// Validator for UUID
const uuidSchema = z.string().uuid();

export async function registerRoutes(app: Express): Promise<Server> {
  // GET health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'TipsyCalculator server is running' });
  });

  // ======== Session Routes ========
  
  // Create a new drinking session
  app.post('/api/sessions', async (req, res) => {
    try {
      console.log("Session creation request body:", req.body);
      const sessionData = insertSessionSchema.parse(req.body);
      console.log("Parsed session data:", sessionData);
      const newSession = await storage.createSession(sessionData);
      res.status(201).json(newSession);
    } catch (error) {
      console.error("Session creation error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create session' });
    }
  });
  
  // Get a specific session
  app.get('/api/sessions/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const validId = uuidSchema.parse(sessionId);
      const session = await storage.getSession(validId);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid session ID' });
      }
      res.status(500).json({ error: 'Failed to retrieve session' });
    }
  });
  
  // Update session points
  app.put('/api/sessions/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const validId = uuidSchema.parse(sessionId);
      const { totalPoints, hasMixedDrinks } = req.body;
      
      if (typeof totalPoints !== 'number' || typeof hasMixedDrinks !== 'boolean') {
        return res.status(400).json({ error: 'Invalid request data' });
      }
      
      const updatedSession = await storage.updateSessionPoints(validId, totalPoints, hasMixedDrinks);
      
      if (!updatedSession) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      res.json(updatedSession);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid session ID' });
      }
      res.status(500).json({ error: 'Failed to update session' });
    }
  });
  
  // Get sessions for a user
  app.get('/api/users/:userId/sessions', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve sessions' });
    }
  });
  
  // ======== Drink Routes ========
  
  // Add drink to a session
  app.post('/api/drinks', async (req, res) => {
    try {
      const drinkData = insertDrinkSchema.parse(req.body);
      const newDrink = await storage.addDrink(drinkData);
      res.status(201).json(newDrink);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to add drink' });
    }
  });
  
  // Get all drinks for a session
  app.get('/api/sessions/:sessionId/drinks', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const validId = uuidSchema.parse(sessionId);
      const drinks = await storage.getSessionDrinks(validId);
      res.json(drinks);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid session ID' });
      }
      res.status(500).json({ error: 'Failed to retrieve drinks' });
    }
  });
  
  // Remove a drink
  app.delete('/api/drinks/:drinkId', async (req, res) => {
    try {
      const drinkId = parseInt(req.params.drinkId);
      
      if (isNaN(drinkId)) {
        return res.status(400).json({ error: 'Invalid drink ID' });
      }
      
      const success = await storage.removeDrink(drinkId);
      
      if (!success) {
        return res.status(404).json({ error: 'Drink not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove drink' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
