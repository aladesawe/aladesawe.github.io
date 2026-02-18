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

    let readme = '';
    const branches = ['main', 'master'];
    for (const branch of branches) {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/${githubInfo.owner}/${githubInfo.repo}/${branch}/README.md`
        );
        if (response.ok) {
          readme = await response.text();
          break;
        }
      } catch {
        continue;
      }
    }

    if (!readme) {
      return res.status(404).json({ message: 'README not found' });
    }

    try {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${githubInfo.owner}/${githubInfo.repo}/commits?author=${githubInfo.owner}&per_page=30`,
        { headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'portfolio-app' } }
      );
      if (commitsRes.ok) {
        const commits = await commitsRes.json() as Array<{
          sha: string;
          html_url: string;
          commit: { message: string; author: { date: string } };
        }>;
        if (commits.length > 0) {
          const parentRes = await fetch(
            `https://api.github.com/repos/${githubInfo.owner}/${githubInfo.repo}`,
            { headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'portfolio-app' } }
          );
          let isFork = false;
          let parentFullName = '';
          if (parentRes.ok) {
            const repoData = await parentRes.json() as { fork: boolean; parent?: { full_name: string; html_url: string } };
            isFork = repoData.fork;
            if (repoData.parent) {
              parentFullName = repoData.parent.full_name;
            }
          }

          readme += '\n\n---\n\n';
          if (isFork && parentFullName) {
            readme += `## My Contributions to this Fork\n\nThis is a fork of [${parentFullName}](https://github.com/${parentFullName}). Below are the changes and improvements I made:\n\n`;
          } else {
            readme += `## My Contributions\n\n`;
          }

          readme += '| Date | Commit | Description |\n|------|--------|-------------|\n';
          for (const commit of commits) {
            const date = new Date(commit.commit.author.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const shortSha = commit.sha.slice(0, 7);
            const message = commit.commit.message.split('\n')[0];
            readme += `| ${date} | [\`${shortSha}\`](${commit.html_url}) | ${message} |\n`;
          }
        }
      }
    } catch {
      // If fetching commits fails, just return the README without contributions
    }

    return res.json({ readme });
  });

  return httpServer;
}
