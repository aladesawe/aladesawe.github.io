import { Project } from "@shared/schema";
import { ExternalLink, Github, Star, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-card border border-border rounded-md p-6 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          {project.isFeatured && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full">
              Featured
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          {project.stars > 0 && (
            <>
              <Star className="w-4 h-4 fill-current opacity-50" />
              <span>{project.stars}</span>
            </>
          )}
        </div>
      </div>

      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
        {project.description}
      </p>

      <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 font-medium">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline decoration-2 underline-offset-4 transition-colors"
            >
              <Globe className="w-4 h-4" />
              Website
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline decoration-2 underline-offset-4 transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          )}
        </div>
        
        {project.language && (
          <span className="text-xs font-mono text-muted-foreground bg-muted/20 px-2 py-1 rounded">
            {project.language}
          </span>
        )}
      </div>
    </motion.div>
  );
}
