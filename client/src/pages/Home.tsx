import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, AlertCircle, Grid } from "lucide-react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data: projects, isLoading, error } = useProjects(activeCategory === "All" ? undefined : activeCategory);

  const categories = ["All", "Computer Vision", "Web", "Mobile", "Library", "Tool"];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="py-12 md:py-16 border-b border-border bg-background">
        <div className="container-custom flex items-center justify-between gap-4">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="container-custom mt-8 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-hero-title">
            Developer Portfolio
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed" data-testid="text-hero-description">
            A collection of projects, tools, and experiments.
            Simple, efficient, and built with modern standards.
          </p>
        </div>
      </header>

      <Navigation 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelect={setActiveCategory} 
      />

      <main className="flex-grow container-custom py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground" data-testid="loading-state">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-destructive" data-testid="error-state">
            <AlertCircle className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-bold mb-2">Unable to load projects</h2>
            <p className="text-muted-foreground">{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              data-testid="button-retry"
            >
              Retry
            </button>
          </div>
        ) : projects?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground" data-testid="empty-state">
            <Grid className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="mb-6">There are no projects in this category yet.</p>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="projects-grid"
          >
            {projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
