import { InterfaceOption } from "../types/dashboard";

type DashboardHighlight = {
  kicker: string;
  title: string;
  helper: string;
};

type DashboardHeaderProps = {
  highlight: DashboardHighlight;
  lastSync: string;
};

export default function DashboardHeader({ highlight, lastSync }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-heading text-[11px] uppercase tracking-[0.4em] text-[color:var(--color-muted)]">
          {highlight.kicker}
        </p>
        <h1 className="font-heading text-[28px] font-semibold tracking-tight text-[color:var(--color-text)]">
          {highlight.title}
        </h1>
        <p className="mt-2 max-w-xl text-[13px] text-[color:var(--color-muted)]">{highlight.helper}</p>
      </div>
      <div className="flex flex-col items-start gap-2 text-[11px] text-[color:var(--color-text)] sm:flex-row sm:items-center">
        <span className="badge-pill badge-pill--accent">Pack mix: M-phase 68% | T-phase 32%</span>
        <span className="badge-pill">Last sync | {lastSync}</span>
      </div>
    </header>
  );
}
