import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Project } from "@shared/schema";

function extractGithubInfo(githubUrl: string): { owner: string; repo: string } | null {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  }
  return null;
}

export default function ReadmePage() {
  const params = useParams<{ slug: string }>();
  
  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ['/api/projects/slug', params.slug],
  });

  const githubInfo = project?.githubUrl ? extractGithubInfo(project.githubUrl) : null;

  const { data: readme, isLoading: readmeLoading, error: readmeError } = useQuery<string>({
    queryKey: ['readme', githubInfo?.owner, githubInfo?.repo],
    queryFn: async () => {
      if (!githubInfo) throw new Error('No GitHub URL');
      const branches = ['main', 'master'];
      for (const branch of branches) {
        try {
          const res = await fetch(
            `https://raw.githubusercontent.com/${githubInfo.owner}/${githubInfo.repo}/${branch}/README.md`
          );
          if (res.ok) return res.text();
        } catch {
          continue;
        }
      }
      throw new Error('README not found');
    },
    enabled: !!githubInfo,
  });

  const isLoading = projectLoading || readmeLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="loading-state">
        <p className="text-muted-foreground">Loading documentation...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4" data-testid="error-state">
        <p className="text-muted-foreground">Project not found</p>
        <Link href="/">
          <Button variant="outline" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold" data-testid="text-project-name">{project.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" data-testid="button-github">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {readmeError ? (
          <div className="text-center py-20" data-testid="readme-error">
            <p className="text-muted-foreground mb-4">Could not load README from GitHub.</p>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" data-testid="button-view-github">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
            )}
          </div>
        ) : (
          <article 
            className="prose prose-neutral dark:prose-invert max-w-none"
            data-testid="readme-content"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {readme || ''}
            </ReactMarkdown>
          </article>
        )}
      </main>
    </div>
  );
}
