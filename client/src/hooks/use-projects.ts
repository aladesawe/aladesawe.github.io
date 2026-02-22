import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

// Load projects directly from static JSON file
async function loadProjects(): Promise<Project[]> {
  const res = await fetch("/projects.json");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return await res.json();
}

// GET /projects.json (static file)
export function useProjects(category?: string) {
  return useQuery({
    queryKey: ["projects", category],
    queryFn: async () => {
      const allProjects = await loadProjects();
      
      // Filter by category if provided
      let filtered = allProjects;
      if (category && category !== "All") {
        filtered = allProjects.filter(p => p.category === category);
      }
      
      return filtered.sort((a, b) => {
        const featuredDiff = (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        if (featuredDiff !== 0) return featuredDiff;
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    },
  });
}

// GET /projects.json then find by slug
export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ["projects", "slug", slug],
    queryFn: async () => {
      const allProjects = await loadProjects();
      return allProjects.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug) || null;
    },
  });
}

// GET /projects.json then find by id
export function useProject(id: number) {
  return useQuery({
    queryKey: ["projects", "id", id],
    queryFn: async () => {
      const allProjects = await loadProjects();
      return allProjects.find(p => p.id === id) || null;
    },
  });
}
