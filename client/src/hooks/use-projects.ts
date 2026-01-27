import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateProjectRequest } from "@shared/routes";

// GET /api/projects
export function useProjects(category?: string) {
  return useQuery({
    queryKey: [api.projects.list.path, category],
    queryFn: async () => {
      // Build URL with query params if category exists
      const url = new URL(api.projects.list.path, window.location.origin);
      if (category && category !== "All") {
        url.searchParams.append("category", category);
      }
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      
      return api.projects.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/projects/:id
export function useProject(id: number) {
  return useQuery({
    queryKey: [api.projects.get.path, id],
    queryFn: async () => {
      // Manual URL building since buildUrl is backend-only helper in this setup context usually, 
      // but we can assume simple string replacement for now or use the helper if available.
      // Using direct template literal for safety in client hook.
      const path = api.projects.get.path.replace(":id", id.toString());
      const res = await fetch(path, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch project");
      
      return api.projects.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/projects
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      const res = await fetch(api.projects.create.path, {
        method: api.projects.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.projects.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create project");
      }
      
      return api.projects.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.projects.list.path] });
    },
  });
}
