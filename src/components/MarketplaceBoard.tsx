"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import type { MarketplaceFilter, MarketplaceProject } from "../types/dashboard";

const statusPillStyles: Record<MarketplaceProject["statusKey"], { background: string; color: string; border: string }> = {
  active: {
    background: "rgba(16, 185, 129, 0.16)",
    color: "rgba(236, 253, 245, 0.9)",
    border: "1px solid rgba(16, 185, 129, 0.35)",
  },
  equipment: {
    background: "rgba(129, 140, 248, 0.16)",
    color: "rgba(196, 181, 253, 0.85)",
    border: "1px solid rgba(129, 140, 248, 0.32)",
  },
  testing: {
    background: "rgba(168, 85, 247, 0.18)",
    color: "rgba(196, 181, 253, 0.85)",
    border: "1px solid rgba(168, 85, 247, 0.4)",
  },
  ready: {
    background: "rgba(16, 185, 129, 0.32)",
    color: "rgba(236, 253, 245, 0.95)",
    border: "1px solid rgba(16, 185, 129, 0.45)",
  },
};

interface StepHeaderProps {
  label: string;
  subtitle?: string;
  done?: boolean;
  open: boolean;
  onToggle: () => void;
}

function StepHeader({ label, subtitle, done, open, onToggle }: StepHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-3 text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(105,129,141,0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-superdark)]"
      style={{
        background: open ? "rgba(17, 33, 45, 0.7)" : "rgba(17, 33, 45, 0.5)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: open ? "var(--secShadow)" : "none",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border"
          style={{
            borderColor: done ? "rgba(16, 185, 129, 0.45)" : "rgba(255, 255, 255, 0.25)",
            background: done ? "rgba(16, 185, 129, 0.24)" : "rgba(17, 33, 45, 0.4)",
            color: done ? "rgba(236, 253, 245, 0.9)" : "rgba(255, 255, 255, 0.55)",
          }}
          aria-hidden
        >
          {done ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.4)]" />}
        </span>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: "var(--color-white)" }}>
            {label}
          </p>
          {subtitle ? (
            <p className="text-[12px]" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <span className="mt-0.5" style={{ color: "rgba(255, 255, 255, 0.6)" }} aria-hidden>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </span>
    </button>
  );
}

function MarketplaceProjectCard({ project }: { project: MarketplaceProject }) {
  const [isClaimOpen, setIsClaimOpen] = useState(true);
  const [isInstallOpen, setIsInstallOpen] = useState(project.statusKey !== "active");
  const [isQaOpen, setIsQaOpen] = useState(project.statusKey === "testing" || project.statusKey === "ready");

  const claimLocked = project.claimState === "Locked";
  const installDone = project.statusKey === "testing" || project.statusKey === "ready";
  const qaDone = project.statusKey === "ready";
  const pillStyle = statusPillStyles[project.statusKey];

  return (
    <article
      className="flex flex-col gap-4 rounded-2xl border p-5"
      style={{
        background: "linear-gradient(150deg, rgba(17, 33, 45, 0.85), rgba(37, 55, 69, 0.6))",
        borderColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "var(--secShadow)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold" style={{ color: "var(--color-white)" }}>
            {project.client}
          </p>
          <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.68)" }}>
            {project.pack} - {project.city}, {project.region}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
          style={pillStyle}
        >
          {project.statusLabel}
        </span>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <StepHeader
            label="Claim"
            subtitle="Apply to take this project"
            done={claimLocked}
            open={isClaimOpen}
            onToggle={() => setIsClaimOpen((prev) => !prev)}
          />
          {isClaimOpen ? (
            <div
              className="rounded-xl border px-4 py-4 text-xs"
              style={{
                background: "rgba(17, 33, 45, 0.7)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="uppercase tracking-[0.18em]" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                    Claim state
                  </p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-white)" }}>
                    {project.claimState}
                  </p>
                  {project.undoWindow ? (
                    <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.58)" }}>
                      Undo until {project.undoWindow}
                    </p>
                  ) : null}
                </div>
                <div>
                  <p className="uppercase tracking-[0.18em]" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                    Deadline
                  </p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-white)" }}>
                    {project.deadline}
                  </p>
                </div>
                <div className="flex items-end justify-end">
                  <button
                    type="button"
                    className="btn-primary min-h-[44px] px-4"
                    style={{
                      background: claimLocked
                        ? "linear-gradient(135deg, rgba(105, 129, 141, 0.6), rgba(44, 74, 82, 0.6))"
                        : undefined,
                      boxShadow: claimLocked ? "none" : undefined,
                      opacity: claimLocked ? 0.7 : 1,
                    }}
                  >
                    {claimLocked ? "Details" : "Claim"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <StepHeader
            label="Equipment & Install"
            subtitle="Prepare kit, deliver, start work"
            done={installDone}
            open={isInstallOpen}
            onToggle={() => setIsInstallOpen((prev) => !prev)}
          />
          {isInstallOpen ? (
            <div
              className="rounded-xl border px-4 py-4 text-xs"
              style={{
                background: "rgba(17, 33, 45, 0.7)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="uppercase tracking-[0.18em]" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                    Installer
                  </p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-white)" }}>
                    {project.installer ?? "Unassigned"}
                  </p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.18em]" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                    Supplier
                  </p>
                  <p className="mt-1 text-sm font-semibold" style={{ color: "var(--color-white)" }}>
                    {project.supplier ?? "Pending"}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px]" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div
                  className="mt-2 h-1.5 rounded-full"
                  style={{ background: "rgba(255, 255, 255, 0.12)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${project.progress}%`,
                      background: "linear-gradient(135deg, var(--color-lightgreen), var(--color-primary))",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <StepHeader
            label="QA & Verify"
            subtitle="Upload evidence and pass QA"
            done={qaDone}
            open={isQaOpen}
            onToggle={() => setIsQaOpen((prev) => !prev)}
          />
          {isQaOpen ? (
            <div
              className="rounded-xl border px-4 py-4 text-xs"
              style={{
                background: "rgba(17, 33, 45, 0.7)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>{project.highlight}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                {project.tags.map((tag) => (
                  <span key={tag} className="chip-soft chip-soft--accent">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button type="button" className="btn-pill">
                  View QA spec
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

interface MarketplaceBoardProps {
  projects: MarketplaceProject[];
  filters: MarketplaceFilter[];
  activeFilter: MarketplaceFilter["key"];
  onFilterChange: (key: MarketplaceFilter["key"]) => void;
  title: string;
  subtitle: string;
}

export default function MarketplaceBoard({
  projects,
  filters,
  activeFilter,
  onFilterChange,
  title,
  subtitle,
}: MarketplaceBoardProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-heading text-[11px] uppercase tracking-[0.3em]" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
            Marketplace
          </p>
          <h2 className="font-heading text-[24px] font-semibold" style={{ color: "var(--color-white)" }}>
            {title}
          </h2>
          <p className="text-[12px]" style={{ color: "rgba(255, 255, 255, 0.68)" }}>
            {subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange(filter.key)}
              className={`btn-pill ${activeFilter === filter.key ? "btn-pill--active" : ""}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <MarketplaceProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
