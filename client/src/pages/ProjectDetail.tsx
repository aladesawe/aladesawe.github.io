import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const params = useParams<{ slug: string }>();
  
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects/slug', params.slug],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="loading-state">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !project) {
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

  const slug = project.name.toLowerCase().replace(/\s+/g, '-');

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
            <h1 className="text-xl font-semibold text-foreground" data-testid="text-project-name">{project.name}</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-semibold text-foreground" data-testid="text-project-title">
              {project.name}
            </h2>
            {project.language && (
              <Badge variant="secondary" className="text-sm" data-testid="badge-language">
                {project.language}
              </Badge>
            )}
          </div>

          <p className="text-lg text-muted-foreground" data-testid="text-description">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            {project.githubUrl && (
              <>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" data-testid="button-github">
                    <SiGithub className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Button>
                </a>
                <Link href={`/projects/${slug}/docs`}>
                  <Button variant="outline" data-testid="button-docs">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                </Link>
              </>
            )}
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <Button data-testid="button-website">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              </a>
            )}
          </div>

          <div className="border-t border-border pt-8 mt-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Category</h3>
            <Badge variant="outline" data-testid="badge-category">{project.category}</Badge>
          </div>
        </div>
      </main>
    </div>
  );
}
