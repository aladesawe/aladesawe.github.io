import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateProjectRequest } from "@shared/routes";
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
      if (category && category !== "All") {
        return allProjects.filter(p => p.category === category);
      }
      
      return allProjects;
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

// POST /api/projects (disabled for static-only deployment)
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      throw new Error("Creating projects is not available in static deployment. Edit projects.json and rebuild.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
