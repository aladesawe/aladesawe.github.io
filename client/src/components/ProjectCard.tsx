import { Project } from "@shared/schema";
import { Github, Star, FileText } from "lucide-react";
import { Link } from "wouter";

interface ProjectCardProps {
  project: Project;
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export function ProjectCard({ project }: ProjectCardProps) {
  const slug = toSlug(project.name);
  
  return (
    <div
      className="group relative flex flex-col bg-card border border-border rounded-md p-6 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
      data-testid={`card-project-${project.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/projects/${slug}`}>
            <h3 
              className="text-lg font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer"
              data-testid={`text-project-name-${project.id}`}
            >
              {project.name}
            </h3>
          </Link>
          {project.isFeatured && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          {project.stars && project.stars > 0 && (
            <>
              <Star className="w-4 h-4 fill-current opacity-50" />
              <span>{project.stars}</span>
            </>
          )}
        </div>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow" data-testid={`text-description-${project.id}`}>
        {project.description}
      </p>

      <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between gap-2 text-sm flex-wrap">
        <div className="flex items-center gap-4 font-medium flex-wrap">
          {project.githubUrl && (
            <Link href={`/projects/${slug}/docs`}>
              <span
                className="flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline decoration-2 underline-offset-4 transition-colors cursor-pointer"
                data-testid={`link-docs-${project.id}`}
              >
                <FileText className="w-4 h-4" />
                Docs
              </span>
            </Link>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline decoration-2 underline-offset-4 transition-colors"
              data-testid={`link-github-${project.id}`}
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
        </div>
        
        {project.language && (
          <span className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded" data-testid={`badge-language-${project.id}`}>
            {project.language}
          </span>
        )}
      </div>
    </div>
  );
}
