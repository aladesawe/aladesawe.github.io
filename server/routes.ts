import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.projects.list.path, async (req, res) => {
    const category = req.query.category as string;
    const projects = await storage.getProjects(category);
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getProjects();
  if (existing.length === 0) {
    await storage.createProject({
      name: "Retrofit",
      description: "A type-safe HTTP client for Android and Java.",
      url: "https://square.github.io/retrofit/",
      githubUrl: "https://github.com/square/retrofit",
      category: "Android",
      language: "Java",
      stars: 42000
    });
    await storage.createProject({
      name: "OkHttp",
      description: "Square's meticulous HTTP client for the JVM, Android, and GraalVM.",
      url: "https://square.github.io/okhttp/",
      githubUrl: "https://github.com/square/okhttp",
      category: "Android",
      language: "Kotlin",
      stars: 45000
    });
    await storage.createProject({
      name: "LeakCanary",
      description: "A memory leak detection library for Android.",
      url: "https://square.github.io/leakcanary/",
      githubUrl: "https://github.com/square/leakcanary",
      category: "Android",
      language: "Kotlin",
      stars: 29000
    });
    await storage.createProject({
      name: "Picasso",
      description: "A powerful image downloading and caching library for Android.",
      url: "https://square.github.io/picasso/",
      githubUrl: "https://github.com/square/picasso",
      category: "Android",
      language: "Java",
      stars: 18000
    });
    await storage.createProject({
      name: "Moshi",
      description: "A modern JSON library for Android, Java and Kotlin.",
      url: "https://github.com/square/moshi",
      githubUrl: "https://github.com/square/moshi",
      category: "Java",
      language: "Kotlin",
      stars: 10000
    });
     await storage.createProject({
      name: "Wire",
      description: "gRPC and protocol buffers for Android, Kotlin, and Java.",
      url: "https://github.com/square/wire",
      githubUrl: "https://github.com/square/wire",
      category: "Kotlin",
      language: "Kotlin",
      stars: 4000
    });
  }
}
