import Reveal from "@/components/ui/Reveal";

export default function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mb-12">
      <div className="flex items-center gap-3 text-xs font-mono text-[var(--accent)]">
        <span>{index}</span>
        <span className="h-px w-10 bg-[var(--accent)]/40" />
      </div>
      <h2 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-muted">{subtitle}</p>}
    </Reveal>
  );
}
