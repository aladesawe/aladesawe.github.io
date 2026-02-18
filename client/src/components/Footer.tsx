export function Footer() {
  return (
    <footer className="mt-20 py-10 border-t border-border">
      <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()}. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="https://linkedin.com/in/adeyemi-aladesawe" className="hover:text-primary transition-colors">LinkedIn</a>
          <a href="https://github.com/aladesawe" className="hover:text-primary transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
