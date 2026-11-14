import Link from "next/link";
import { Github, ImagePlus, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card/70">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ImagePlus className="size-4 text-primary" /> Image Studio
          <span className="ml-2 font-normal text-muted-foreground">Create, save, and share.</span>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
          <a href="https://github.com/saqlain991/Image-Gen_AI" aria-label="GitHub" className="hover:text-foreground"><Github className="size-4" /></a>
          <a href="mailto:saqlainsultan991@gmail.com" aria-label="Email" className="hover:text-foreground"><Mail className="size-4" /></a>
          <span>© {new Date().getUTCFullYear()} Image Studio</span>
        </div>
      </div>
    </footer>
  );
}
