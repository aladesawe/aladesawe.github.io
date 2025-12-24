import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

function extractGithubInfo(githubUrl: string): { owner: string; repo: string } | null {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  }
  return null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.projects.list.path, async (req, res) => {
    const category = req.query.category as string;
    const projects = await storage.getProjects(category);
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  });

  app.get(api.projects.getBySlug.path, async (req, res) => {
    const project = await storage.getProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  });

  app.get('/api/projects/slug/:slug/readme', async (req, res) => {
    const project = await storage.getProjectBySlug(req.params.slug);
    if (!project || !project.githubUrl) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const githubInfo = extractGithubInfo(project.githubUrl);
    if (!githubInfo) {
      return res.status(400).json({ message: 'Invalid GitHub URL' });
    }

    const branches = ['main', 'master'];
    for (const branch of branches) {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${githubInfo.owner}/${githubInfo.repo}/${branch}/README.md`
        );
        if (response.ok) {
          const readme = await response.text();
          return res.json({ readme });
        }
      } catch {
        continue;
      }
    }

    return res.status(404).json({ message: 'README not found' });
  });

  return httpServer;
}
