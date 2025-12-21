import type { Project } from "@shared/schema";

// Static projects data - easy to maintain, no database needed
const projects: Project[] = [
  {
    id: 1,
    name: "Retrofit",
    description: "A type-safe HTTP client for Android and Java.",
    url: "https://square.github.io/retrofit/",
    githubUrl: "https://github.com/square/retrofit",
    category: "Android",
    language: "Java",
    stars: 42000,
    isFeatured: true
  },
  {
    id: 2,
    name: "OkHttp",
    description: "Square's meticulous HTTP client for the JVM, Android, and GraalVM.",
    url: "https://square.github.io/okhttp/",
    githubUrl: "https://github.com/square/okhttp",
    category: "Android",
    language: "Kotlin",
    stars: 45000,
    isFeatured: true
  },
  {
    id: 3,
    name: "LeakCanary",
    description: "A memory leak detection library for Android.",
    url: "https://square.github.io/leakcanary/",
    githubUrl: "https://github.com/square/leakcanary",
    category: "Android",
    language: "Kotlin",
    stars: 29000,
    isFeatured: false
  },
  {
    id: 4,
    name: "Picasso",
    description: "A powerful image downloading and caching library for Android.",
    url: "https://square.github.io/picasso/",
    githubUrl: "https://github.com/square/picasso",
    category: "Android",
    language: "Java",
    stars: 18000,
    isFeatured: false
  },
  {
    id: 5,
    name: "Moshi",
    description: "A modern JSON library for Android, Java and Kotlin.",
    url: "https://github.com/square/moshi",
    githubUrl: "https://github.com/square/moshi",
    category: "Java",
    language: "Kotlin",
    stars: 10000,
    isFeatured: false
  },
  {
    id: 6,
    name: "Wire",
    description: "gRPC and protocol buffers for Android, Kotlin, and Java.",
    url: "https://github.com/square/wire",
    githubUrl: "https://github.com/square/wire",
    category: "Kotlin",
    language: "Kotlin",
    stars: 4000,
    isFeatured: false
  }
];

export interface IStorage {
  getProjects(category?: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
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
}

export const storage = new MemStorage();
