import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Project } from "@shared/schema";
import type { Components } from "react-markdown";
import { useProjectBySlug } from "@/hooks/use-projects";

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.MOV'];

function isVideoUrl(url: string): boolean {
  return VIDEO_EXTENSIONS.some(ext => url.toLowerCase().endsWith(ext.toLowerCase()));
}

const markdownComponents: Components = {
  img: ({ src, alt, ...props }) => {
    if (src && isVideoUrl(src)) {
      return (
        <video
          src={src}
          controls
          width="100%"
          style={{ maxWidth: '640px', borderRadius: '8px' }}
          aria-label={alt || 'Video'}
          data-testid="video-element"
        >
          Your browser does not support the video tag.
        </video>
      );
    }
    return <img src={src} alt={alt} {...props} />;
  },
};

function preprocessMarkdown(md: string): string {
  return md.replace(
    /<video[^>]*src="([^"]+)"[^>]*>.*?<\/video>/gi,
    (_, src) => `![Video](${src})`
  );
}

function extractGithubInfo(githubUrl: string): { owner: string; repo: string } | null {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  }
  return null;
}

async function fetchReadmeWithContributions(githubUrl: string): Promise<string> {
  const githubInfo = extractGithubInfo(githubUrl);
  if (!githubInfo) throw new Error("Invalid GitHub URL");

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

  if (!readme) throw new Error("README not found");

  try {
    const commitsRes = await fetch(
      `https://api.github.com/repos/${githubInfo.owner}/${githubInfo.repo}/commits?author=${githubInfo.owner}&per_page=30`,
      { headers: { 'Accept': 'application/vnd.github.v3+json' } }
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
          { headers: { 'Accept': 'application/vnd.github.v3+json' } }
        );
        let isFork = false;
        let parentFullName = '';
        if (parentRes.ok) {
          const repoData = await parentRes.json() as { fork: boolean; parent?: { full_name: string } };
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

  return readme;
}

export default function ReadmePage() {
  const params = useParams<{ slug: string }>();
  
  const { data: project, isLoading: projectLoading } = useProjectBySlug(params.slug);

  const { data: readme, isLoading: readmeLoading, error: readmeError } = useQuery<string>({
    queryKey: ["readme", params.slug],
    queryFn: () => fetchReadmeWithContributions(project!.githubUrl!),
    enabled: !!project?.githubUrl,
  });

  const processedReadme = readme ? preprocessMarkdown(readme) : '';
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
            <ThemeToggle />
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
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {processedReadme}
            </ReactMarkdown>
          </article>
        )}
      </main>
    </div>
  );
}
