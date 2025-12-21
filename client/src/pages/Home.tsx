import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { Logo } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { Loader2, AlertCircle, Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  // We fetch 'All' initially, handling client-side filtering or server-side if queryParam changes.
  // For this design, let's trigger refetch on category change if we want server filtering,
  // OR fetch all and filter client side. The hook supports server filtering.
  const { data: projects, isLoading, error } = useProjects(activeCategory === "All" ? undefined : activeCategory);

  const categories = ["All", "Web", "Mobile", "Library", "Tool", "Game"];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="py-12 md:py-16 border-b border-border bg-background">
        <div className="container-custom flex items-center justify-between">
          <Logo />
          <div className="hidden sm:block">
            <CreateProjectDialog />
          </div>
        </div>
        <div className="container-custom mt-8 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Building software that matters.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A collection of open source projects, tools, and experiments.
            Simple, efficient, and built with modern standards.
          </p>
        </div>
      </header>

      {/* Navigation Filter */}
      <Navigation 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelect={setActiveCategory} 
      />

      {/* Mobile Add Button */}
      <div className="sm:hidden px-6 pt-6">
        <div className="w-full">
           <CreateProjectDialog />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container-custom py-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in duration-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-destructive animate-in fade-in duration-500">
            <AlertCircle className="w-12 h-12 mb-4" />
            <h2 className="text-xl font-bold mb-2">Unable to load projects</h2>
            <p className="text-muted-foreground">{error.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        ) : projects?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in duration-500">
            <Grid className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="mb-6">There are no projects in this category yet.</p>
            <CreateProjectDialog />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {projects?.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
