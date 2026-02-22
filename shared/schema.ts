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
  createdAt: string | null;
}
