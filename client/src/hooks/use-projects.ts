import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateProjectRequest } from "@shared/routes";
import type { Project } from "@shared/schema";

// GET /projects.json (static file)
export function useProjects(category?: string) {
  return useQuery({
    queryKey: [api.projects.list.path, category],
    queryFn: async () => {
      const res = await fetch("/projects.json");
      if (!res.ok) throw new Error("Failed to fetch projects");
      
      const allProjects: Project[] = await res.json();
      
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
    queryKey: [api.projects.getBySlug.path, slug],
    queryFn: async () => {
      const res = await fetch("/projects.json");
      if (!res.ok) throw new Error("Failed to fetch projects");
      
      const allProjects: Project[] = await res.json();
      return allProjects.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === slug) || null;
    },
  });
}

// GET /api/projects/:id (kept for compatibility, but fetches from static file)
export function useProject(id: number) {
  return useQuery({
    queryKey: [api.projects.get.path, id],
    queryFn: async () => {
      const res = await fetch("/projects.json");
      if (!res.ok) throw new Error("Failed to fetch projects");
      
      const allProjects: Project[] = await res.json();
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
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
    },
  });
}
