import { motion } from "framer-motion";

interface NavigationProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export function Navigation({ categories, activeCategory, onSelect }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container-custom">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`
                relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap
                ${activeCategory === category 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {category}
              {activeCategory === category && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
