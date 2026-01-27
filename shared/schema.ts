import { z } from "zod";

// Simple project type - no database needed
export interface Project {
  id: number;
  name: string;
  description: string;
  url: string | null;
  githubUrl: string | null;
  category: string;
  language: string | null;
  stars: number | null;
  isFeatured: boolean | null;
}

export const insertProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  category: z.string().default("General"),
  language: z.string().nullable().optional(),
  stars: z.number().nullable().optional(),
  isFeatured: z.boolean().nullable().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type CreateProjectRequest = InsertProject;
export type UpdateProjectRequest = Partial<InsertProject>;
