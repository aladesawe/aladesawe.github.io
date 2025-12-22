import type { Project } from "@shared/schema";

// Your projects - edit this list to add/remove projects
const projects: Project[] = [
  {
    id: 1,
    name: "Vision Mask",
    description: "Computer vision project for mask detection and analysis.",
    url: null,
    githubUrl: "https://github.com/aladesawe/vision_mask",
    category: "Computer Vision",
    language: "Python",
    stars: null,
    isFeatured: true
  }
];

export interface IStorage {
  getProjects(category?: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
}

export class MemStorage implements IStorage {
  async getProjects(category?: string): Promise<Project[]> {
    if (category && category !== "All") {
      return projects.filter(p => p.category === category);
    }
    return projects;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return projects.find(p => p.id === id);
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    return projects.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug);
  }
}

export const storage = new MemStorage();
