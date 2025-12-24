import { Link } from "wouter";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3 no-underline">
      <div className="relative flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
        <span className="font-mono text-2xl font-bold leading-none select-none">@</span>
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
        Yemi
      </span>
    </Link>
  );
}
