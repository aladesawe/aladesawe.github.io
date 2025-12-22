import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@shared/schema";

export default function ProjectDetail() {
  const params = useParams<{ slug: string }>();
  
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects/slug', params.slug],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" data-testid="loading-state">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4" data-testid="error-state">
        <p className="text-gray-500">Project not found</p>
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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold text-gray-900" data-testid="text-project-name">
              {project.name}
            </h1>
            {project.language && (
              <Badge variant="secondary" className="text-sm" data-testid="badge-language">
                {project.language}
              </Badge>
            )}
          </div>

          <p className="text-xl text-gray-600" data-testid="text-description">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" data-testid="button-github">
                  <SiGithub className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
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

          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Category</h2>
            <Badge variant="outline" data-testid="badge-category">{project.category}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
