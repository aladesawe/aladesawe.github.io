import { Link } from "wouter";
import LogoIcon from "@/components/LogoIcon";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3 no-underline">
      <LogoIcon size={28} className="text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
        Yemi
      </span>
    </Link>
  );
}
