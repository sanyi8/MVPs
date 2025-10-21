import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateTaskSuggestion(userInput: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Based on this input, suggest a brief task title (max 8 words): "${userInput}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating task suggestion:", error);
    return "";
  }
}

export async function generateTaskDescription(taskTitle: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Write a brief task description for "${taskTitle}". Keep it under 30 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating task description:", error);
    return "";
  }
}

export async function organizeTask(taskTitle: string, taskDescription: string): Promise<{
  title: string;
  description: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `The user scribbled this task quickly. Clean it up and organize it professionally. Keep it SHORT and SIMPLE. Return JSON with "title" (max 6 words, clear and actionable) and "description" (max 20 words, essential details only).

Input: ${taskTitle}${taskDescription ? `\n${taskDescription}` : ""}

Rules:
- Remove typos and fix grammar
- Make title concise and action-oriented
- Keep only essential information
- Use simple, clear language`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    try {
      const parsed = JSON.parse(content);
      return {
        title: parsed.title || taskTitle,
        description: parsed.description || taskDescription
      };
    } catch (e) {
      return { title: taskTitle, description: taskDescription };
    }
  } catch (error) {
    console.error("Error organizing task:", error);
    return { title: taskTitle, description: taskDescription };
  }
}

export async function prioritizeTasks(tasks: Array<{ id: number; title: string; description?: string }>): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `Prioritize these tasks by urgency and importance. Time-sensitive tasks (with dates like "tomorrow", "Friday", "ASAP") come first. Tasks marked "later" go last. Return JSON with "prioritizedTaskIds" array containing task IDs in priority order.

Tasks: ${JSON.stringify(tasks)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed.prioritizedTaskIds) ? parsed.prioritizedTaskIds : tasks.map(t => t.id);
    } catch (e) {
      return tasks.map(t => t.id);
    }
  } catch (error) {
    console.error("Error prioritizing tasks:", error);
    return tasks.map(t => t.id);
  }
}