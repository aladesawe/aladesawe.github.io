import { db } from "./db";
import {
  projects,
  type CreateProjectRequest,
  type Project
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProjects(category?: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: CreateProjectRequest): Promise<Project>;
}

export class DatabaseStorage implements IStorage {
  async getProjects(category?: string): Promise<Project[]> {
    if (category && category !== "All") {
      return await db.select().from(projects).where(eq(projects.category, category));
    }
    return await db.select().from(projects);
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: CreateProjectRequest): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }
}

export const storage = new DatabaseStorage();
