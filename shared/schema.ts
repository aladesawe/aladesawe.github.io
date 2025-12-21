import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url"), // Live site URL
  githubUrl: text("github_url"), // Repo URL
  category: text("category").notNull().default("General"),
  language: text("language"),
  stars: integer("stars").default(0),
  isFeatured: boolean("is_featured").default(false),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ 
  id: true 
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

// Explicit API types
export type CreateProjectRequest = InsertProject;
export type UpdateProjectRequest = Partial<InsertProject>;
