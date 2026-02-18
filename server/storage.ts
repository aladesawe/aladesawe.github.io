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
  },
  {
    id: 2,
    name: "Split Records",
    description: "A C utility to split large database-exported files by record boundaries, inspired by the deficiency in the Unix split utility which can split a record across multiple files.",
    url: null,
    githubUrl: "https://github.com/AdeyemiA/split_records",
    category: "Tool",
    language: "C",
    stars: null,
    isFeatured: false
  },
  {
    id: 3,
    name: "Neural Networks and Deep Learning",
    description: "Fork of Michael Nielsen's neural network codebase with Python 3.11 support, matrix-based SGD, early stopping, learning rate scheduling, and modern tensor library updates.",
    url: null,
    githubUrl: "https://github.com/aladesawe/neural-networks-and-deep-learning",
    category: "Deep Learning",
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
