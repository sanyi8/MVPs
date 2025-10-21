import { apiRequest } from "./queryClient";

// Get a task suggestion based on user input
export async function getSuggestion(userInput: string): Promise<string> {
  try {
    const res = await apiRequest("POST", "/api/ai/suggest", { userInput });
    const data = await res.json();
    return data.suggestion;
  } catch (error) {
    console.error("Error getting suggestion:", error);
    return "";
  }
}

// Get a task description based on title
export async function getDescription(title: string): Promise<string> {
  try {
    const res = await apiRequest("POST", "/api/ai/describe", { title });
    const data = await res.json();
    return data.description;
  } catch (error) {
    console.error("Error getting description:", error);
    return "";
  }
}

// Organize a task (improve title and description)
export async function organizeTask(title: string, description: string = ""): Promise<{
  title: string;
  description: string;
}> {
  try {
    const res = await apiRequest("POST", "/api/ai/organize", { title, description });
    return await res.json();
  } catch (error) {
    console.error("Error organizing task:", error);
    return { title, description };
  }
}

// Prioritize tasks
export async function prioritizeTasks(tasks: Array<{ id: number; title: string; description?: string }>): Promise<{
  success: boolean;
  prioritizedIds: number[];
  activeTasks: any[];
}> {
  try {
    const res = await apiRequest("POST", "/api/ai/prioritize", { tasks });
    return await res.json();
  } catch (error) {
    console.error("Error prioritizing tasks:", error);
    return { success: false, prioritizedIds: [], activeTasks: [] };
  }
}