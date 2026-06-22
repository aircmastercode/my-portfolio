import { profile } from "@/data/profile";
import VisitorCounter from "@/components/ui/VisitorCounter";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {profile.name}. Built with Next.js, Three.js & Claude.
          </p>
          <VisitorCounter variant="footer" />
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" data-hover className="link-underline text-muted hover:text-fg">
            LinkedIn
          </a>
          <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" data-hover className="link-underline text-muted hover:text-fg">
            GitHub
          </a>
          <a href={profile.socials.medium} target="_blank" rel="noopener noreferrer" data-hover className="link-underline text-muted hover:text-fg">
            Medium
          </a>
        </div>
      </div>
    </footer>
  );
}
