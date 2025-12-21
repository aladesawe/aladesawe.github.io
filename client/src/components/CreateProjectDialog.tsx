import { useState } from "react";
import { useCreateProject } from "@/hooks/use-projects";
import { Plus, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useToast } from "@/hooks/use-toast";

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateProject();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    mutate({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string || "General",
      url: formData.get("url") as string || undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
      language: formData.get("language") as string || undefined,
      isFeatured: formData.get("isFeatured") === "on",
      stars: Number(formData.get("stars") || 0),
    }, {
      onSuccess: () => {
        setOpen(false);
        toast({
          title: "Project created",
          description: "Your new project has been added to the portfolio.",
        });
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      }
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
              Add New Project
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">
              Fill in the details below to add a project to your portfolio.
            </Dialog.Description>
          </div>
          
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Project Name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium leading-none">Category</label>
                <select 
                  id="category" 
                  name="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="General">General</option>
                  <option value="Web">Web</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Library">Library</option>
                  <option value="Tool">Tool</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium leading-none">Description</label>
              <textarea
                id="description"
                name="description"
                required
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Brief description of the project..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium leading-none">Website URL</label>
                <input
                  id="url"
                  name="url"
                  type="url"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-input focus-visible:ring-ring"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="githubUrl" className="text-sm font-medium leading-none">GitHub URL</label>
                <input
                  id="githubUrl"
                  name="githubUrl"
                  type="url"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-input focus-visible:ring-ring"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <label htmlFor="language" className="text-sm font-medium leading-none">Language</label>
                <input
                  id="language"
                  name="language"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-input focus-visible:ring-ring"
                  placeholder="e.g. TypeScript"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stars" className="text-sm font-medium leading-none">Stars</label>
                <input
                  id="stars"
                  name="stars"
                  type="number"
                  defaultValue={0}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm border-input focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input 
                type="checkbox" 
                id="isFeatured" 
                name="isFeatured"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Feature this project?
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Dialog.Close asChild>
                <button type="button" className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button 
                type="submit" 
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
              >
                {isPending ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
          
          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
