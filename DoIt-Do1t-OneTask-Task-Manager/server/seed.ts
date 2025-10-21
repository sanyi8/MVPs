
import { db } from "./db";
import { tasks } from "@shared/schema";

async function seed() {
  console.log("Seeding database with test data...");

  const testTasks = [
    {
      title: "Review project proposal",
      description: "Check the latest project proposal and provide feedback by end of week",
      completed: false,
      position: 1,
    },
    {
      title: "Buy groceries tomorrow",
      description: "Get milk, eggs, bread, and vegetables for the weekend",
      completed: false,
      position: 2,
    },
    {
      title: "Call dentist for appointment",
      description: "Schedule routine checkup for next month",
      completed: false,
      position: 3,
    },
    {
      title: "Finish reading book",
      description: "Complete the last 3 chapters of current book",
      completed: false,
      position: 4,
    },
    {
      title: "Plan weekend trip",
      description: "Research destinations and book accommodation",
      completed: false,
      position: 5,
    },
    {
      title: "Update resume",
      description: "Add recent projects and skills to resume",
      completed: true,
      position: 6,
    },
    {
      title: "Exercise routine",
      description: "Complete 30-minute workout session",
      completed: true,
      position: 7,
    },
  ];

  try {
    await db.insert(tasks).values(testTasks);
    console.log(`✓ Successfully added ${testTasks.length} test tasks`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }

  process.exit(0);
}

seed();
