"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { Calendar, ExternalLink, Info, MapPin, TrendingUp, Undo2 } from "lucide-react";

export type ProjectStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "EQUIPMENT_REQUESTED"
  | "EQUIPMENT_DELIVERED"
  | "INSTALLING"
  | "TESTING"
  | "VERIFIED"
  | "REWORK"
  | "CLOSED";

export type Phase = "M" | "T";

export interface Project {
  id: string;
  packCode: string;
  kw: number;
  phase: Phase;
  city: string;
  region: string;
  status: ProjectStatus;
  deadlineAt?: string;
  royaltyEstimateMAD?: number;
  undoUntil?: string;
  assigned?: boolean;
  distanceKm?: number;
}

const isoDaysFromNow = (days: number): string => {
  const date = new Date();
  date.setUTCHours(10, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
};

const minutesFromNow = (minutes: number): string => {
  const ms = Date.now() + minutes * 60 * 1000;
  const date = new Date(ms);
  return date.toISOString();
};

const formatMAD = (value?: number): string =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const phaseLabel: Record<Phase, string> = {
  M: "Maintenance",
  T: "Turnkey",
};

type StatusStyle = {
  label: string;
  backgroundColor: string;
  color: string;
  borderColor: string;
};

const statusConfig: Record<ProjectStatus, StatusStyle> = {
  DRAFT: {
    label: "Draft",
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    color: "rgba(148, 163, 184, 0.75)",
    borderColor: "rgba(148, 163, 184, 0.28)",
  },
  PENDING_PAYMENT: {
    label: "Pending Payment",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "rgba(147, 197, 253, 0.85)",
    borderColor: "rgba(59, 130, 246, 0.32)",
  },
  ACTIVE: {
    label: "Active",
    backgroundColor: "rgba(16, 185, 129, 0.14)",
    color: "rgba(16, 185, 129, 0.85)",
    borderColor: "rgba(16, 185, 129, 0.38)",
  },
  IN_PROGRESS: {
    label: "In Progress",
    backgroundColor: "rgba(56, 189, 248, 0.18)",
    color: "rgba(56, 189, 248, 0.85)",
    borderColor: "rgba(56, 189, 248, 0.42)",
  },
  EQUIPMENT_REQUESTED: {
    label: "Equip. Requested",
    backgroundColor: "rgba(129, 140, 248, 0.18)",
    color: "rgba(129, 140, 248, 0.8)",
    borderColor: "rgba(129, 140, 248, 0.4)",
  },
  EQUIPMENT_DELIVERED: {
    label: "Equip. Delivered",
    backgroundColor: "rgba(99, 102, 241, 0.18)",
    color: "rgba(99, 102, 241, 0.8)",
    borderColor: "rgba(99, 102, 241, 0.42)",
  },
  INSTALLING: {
    label: "Installing",
    backgroundColor: "rgba(59, 130, 246, 0.18)",
    color: "rgba(96, 165, 250, 0.88)",
    borderColor: "rgba(59, 130, 246, 0.4)",
  },
  TESTING: {
    label: "Testing",
    backgroundColor: "rgba(168, 85, 247, 0.18)",
    color: "rgba(196, 181, 253, 0.85)",
    borderColor: "rgba(168, 85, 247, 0.42)",
  },
  VERIFIED: {
    label: "Verified",
    backgroundColor: "rgba(16, 185, 129, 0.28)",
    color: "rgba(236, 253, 245, 0.95)",
    borderColor: "rgba(16, 185, 129, 0.5)",
  },
  REWORK: {
    label: "Rework",
    backgroundColor: "rgba(244, 63, 94, 0.16)",
    color: "rgba(252, 165, 165, 0.88)",
    borderColor: "rgba(244, 63, 94, 0.42)",
  },
  CLOSED: {
    label: "Closed",
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    color: "rgba(148, 163, 184, 0.75)",
    borderColor: "rgba(148, 163, 184, 0.28)",
  },
};

const parseIsoDate = (iso?: string): Date | undefined => {
  if (!iso) {
    return undefined;
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

interface CountdownState {
  ms: number;
  label: string;
}

const countdownInitial: CountdownState = { ms: 0, label: "00:00" };

const calculateCountdown = (iso?: string): CountdownState => {
  const target = parseIsoDate(iso);
  if (!target) {
    return countdownInitial;
  }
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return countdownInitial;
  }
  const totalSeconds = Math.floor(diff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return {
    ms: diff,
    label: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
  };
};

const useCountdown = (iso?: string): CountdownState => {
  const [state, setState] = useState<CountdownState>(countdownInitial);

  useEffect(() => {
    setState(calculateCountdown(iso));
    if (!iso) {
      return undefined;
    }
    const interval = window.setInterval(() => {
      setState(calculateCountdown(iso));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [iso]);

  return state;
};

interface ProjectCardProps {
  project: Project;
  onClaim?: (project: Project) => void;
  onUndo?: (project: Project) => void;
  onOpen?: (project: Project) => void;
}

export function ProjectCard({ project, onClaim, onUndo, onOpen }: ProjectCardProps) {
  const countdown = useCountdown(project.undoUntil);

  const deadlineDate = useMemo(() => parseIsoDate(project.deadlineAt), [project.deadlineAt]);
  const isFinalized = useMemo(
    () => ["TESTING", "VERIFIED", "CLOSED"].includes(project.status),
    [project.status],
  );
  const isOverdue = useMemo(() => {
    if (!deadlineDate || isFinalized) {
      return false;
    }
    return deadlineDate.getTime() < Date.now();
  }, [deadlineDate, isFinalized]);

  const deadlineLabel = useMemo(() => {
    if (!deadlineDate) {
      return "No deadline";
    }
    if (isOverdue) {
      return "Overdue";
    }
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
    }).format(deadlineDate);
  }, [deadlineDate, isOverdue]);

  const status = statusConfig[project.status];
  const canClaim =
    !project.assigned &&
    (project.status === "ACTIVE" || project.status === "IN_PROGRESS");
  const canUndo = Boolean(project.undoUntil && countdown.ms > 0);

  return (
    <article
      className="flex flex-col rounded-2xl border backdrop-blur-sm transition duration-200 hover:-translate-y-0.5"
      style={{
        background: "linear-gradient(150deg, rgba(37, 55, 69, 0.7), rgba(17, 33, 45, 0.94))",
        borderColor: "rgba(255, 255, 255, 0.08)",
        boxShadow: "var(--secShadow)",
      }}
    >
      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-semibold" style={{ color: "var(--color-white)" }}>
              {project.packCode}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: "rgba(105, 129, 141, 0.18)",
                color: "var(--color-lightgray)",
                border: "1px solid rgba(105, 129, 141, 0.3)",
              }}
            >
              {project.kw.toFixed(1)} kW
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: "rgba(44, 74, 82, 0.32)",
                color: "var(--color-softgreen)",
                border: "1px solid rgba(204, 208, 207, 0.18)",
              }}
            >
              {phaseLabel[project.phase]}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              <MapPin className="h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.55)" }} />
              {project.city}, {project.region}
            </span>
            <span
              className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{
                backgroundColor: status.backgroundColor,
                color: status.color,
                borderColor: status.borderColor,
              }}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{
              backgroundColor: "rgba(37, 55, 69, 0.42)",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <TrendingUp className="h-4 w-4" style={{ color: "var(--color-softgreen)" }} />
            <div>
              <p className="text-xs uppercase tracking-wide" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                Royalty
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--color-white)" }}>
                {formatMAD(project.royaltyEstimateMAD)}
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{
              backgroundColor: "rgba(37, 55, 69, 0.42)",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
          >
            <Calendar
              className="h-4 w-4"
              style={{ color: isOverdue ? "rgba(248, 113, 113, 0.8)" : "var(--color-softgreen)" }}
            />
            <div>
              <p className="text-xs uppercase tracking-wide" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                Deadline
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: isOverdue ? "rgba(248, 113, 113, 0.85)" : "var(--color-white)" }}
              >
                {deadlineLabel}
              </p>
            </div>
          </div>
          {typeof project.distanceKm === "number" ? (
            <div
              className="hidden items-center gap-2 rounded-xl border px-3 py-2 md:flex"
              style={{
                backgroundColor: "rgba(37, 55, 69, 0.42)",
                borderColor: "rgba(255, 255, 255, 0.08)",
              }}
            >
              <MapPin className="h-4 w-4" style={{ color: "var(--color-softgreen)" }} />
              <div>
                <p className="text-xs uppercase tracking-wide" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                  Distance
                </p>
                <p className="text-sm font-semibold" style={{ color: "var(--color-white)" }}>
                  {project.distanceKm.toFixed(1)} km
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div
          className="flex items-start gap-2 rounded-xl border px-3 py-3"
          style={{
            backgroundColor: "rgba(19, 46, 53, 0.5)",
            borderColor: "rgba(105, 129, 141, 0.26)",
          }}
        >
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--color-softgreen)" }} />
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.72)" }}>
            Pack details in BOM and QA templates stay pinned once claimed. Installer QA kits auto-sync to the crew
            workspace.
          </p>
        </div>
      </div>

      <div
        className="flex flex-col gap-2 border-t px-5 py-4 sm:flex-row sm:flex-wrap"
        style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
      >
        <button
          type="button"
          onClick={() => onOpen?.(project)}
          className="flex h-11 w-full items-center justify-center rounded-xl border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(105,129,141,0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-superdark)] sm:w-auto"
          style={{
            background: "transparent",
            borderColor: "rgba(255, 255, 255, 0.18)",
            color: "var(--color-white)",
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open
        </button>
        <button
          type="button"
          onClick={() => onClaim?.(project)}
          disabled={!canClaim}
          className="flex h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(105,129,141,0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-superdark)] sm:w-auto"
          style={{
            background: canClaim ? "var(--color-lightgreen)" : "rgba(44, 74, 82, 0.38)",
            color: "var(--color-white)",
            boxShadow: canClaim ? "var(--mainShadow)" : "none",
            opacity: canClaim ? 1 : 0.6,
          }}
        >
          Claim
        </button>
        {project.undoUntil ? (
          <button
            type="button"
            onClick={() => onUndo?.(project)}
            disabled={!canUndo}
            className="flex h-11 w-full items-center justify-center rounded-xl border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(105,129,141,0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-superdark)] sm:w-auto"
            style={{
              background: "rgba(19, 46, 53, 0.42)",
              borderColor: "rgba(105, 129, 141, 0.32)",
              color: "var(--color-softgreen)",
              opacity: canUndo ? 1 : 0.5,
            }}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            {canUndo ? `Undo (${countdown.label})` : "Undo"}
          </button>
        ) : null}
      </div>
    </article>
  );
}

interface ProjectCardGridProps {
  projects: Project[];
  onClaim?: (project: Project) => void;
  onUndo?: (project: Project) => void;
  onOpen?: (project: Project) => void;
  emptyState?: ReactNode;
}

export function ProjectCardGrid({ projects, onClaim, onUndo, onOpen, emptyState }: ProjectCardGridProps) {
  if (projects.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border px-6 py-12 text-center"
        style={{
          background: "rgba(17, 33, 45, 0.6)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        {emptyState ?? (
          <>
            <h3 className="text-base font-semibold" style={{ color: "var(--color-white)" }}>
              No marketplace projects yet
            </h3>
            <p className="max-w-sm text-sm" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
              New assignments will drop here once the marketplace opens up for your crew radius.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClaim={onClaim}
          onUndo={onUndo}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

export const sampleProjects10: Project[] = [
  {
    id: "prj-001",
    packCode: "ONG-010-T",
    kw: 12.8,
    phase: "T",
    city: "Casablanca",
    region: "Casablanca-Settat",
    status: "ACTIVE",
    deadlineAt: isoDaysFromNow(5),
    royaltyEstimateMAD: 6800,
    assigned: false,
    distanceKm: 14.2,
  },
  {
    id: "prj-002",
    packCode: "ONG-016-M",
    kw: 9.5,
    phase: "M",
    city: "Rabat",
    region: "Rabat-Sale-Kenitra",
    status: "IN_PROGRESS",
    deadlineAt: isoDaysFromNow(2),
    royaltyEstimateMAD: 5400,
    assigned: true,
    distanceKm: 7.8,
    undoUntil: minutesFromNow(12),
  },
  {
    id: "prj-003",
    packCode: "ONG-021-T",
    kw: 18.4,
    phase: "T",
    city: "Marrakesh",
    region: "Marrakesh-Safi",
    status: "TESTING",
    deadlineAt: isoDaysFromNow(1),
    royaltyEstimateMAD: 8900,
    assigned: true,
    distanceKm: 4.6,
  },
  {
    id: "prj-004",
    packCode: "ONG-008-M",
    kw: 6.2,
    phase: "M",
    city: "Tangier",
    region: "Tanger-Tetouan-Al Hoceima",
    status: "VERIFIED",
    deadlineAt: isoDaysFromNow(-1),
    royaltyEstimateMAD: 4200,
    assigned: true,
    distanceKm: 11.9,
  },
  {
    id: "prj-005",
    packCode: "ONG-019-T",
    kw: 15.1,
    phase: "T",
    city: "Agadir",
    region: "Souss-Massa",
    status: "REWORK",
    deadlineAt: isoDaysFromNow(-2),
    royaltyEstimateMAD: 7600,
    assigned: true,
    distanceKm: 23.3,
    undoUntil: minutesFromNow(3),
  },
  {
    id: "prj-006",
    packCode: "ONG-012-M",
    kw: 11.2,
    phase: "M",
    city: "Fes",
    region: "Fes-Meknes",
    status: "INSTALLING",
    deadlineAt: isoDaysFromNow(3),
    royaltyEstimateMAD: 6100,
    assigned: true,
    distanceKm: 18.7,
  },
  {
    id: "prj-007",
    packCode: "ONG-025-T",
    kw: 22.4,
    phase: "T",
    city: "Kenitra",
    region: "Rabat-Sale-Kenitra",
    status: "EQUIPMENT_REQUESTED",
    deadlineAt: isoDaysFromNow(6),
    royaltyEstimateMAD: 9900,
    assigned: false,
    distanceKm: 12.1,
  },
  {
    id: "prj-008",
    packCode: "ONG-031-M",
    kw: 7.3,
    phase: "M",
    city: "Oujda",
    region: "Oriental",
    status: "EQUIPMENT_DELIVERED",
    deadlineAt: isoDaysFromNow(4),
    royaltyEstimateMAD: 5300,
    assigned: true,
    distanceKm: 28.4,
  },
  {
    id: "prj-009",
    packCode: "ONG-005-T",
    kw: 5.6,
    phase: "T",
    city: "Laayoune",
    region: "Laayoune-Sakia El Hamra",
    status: "PENDING_PAYMENT",
    deadlineAt: isoDaysFromNow(8),
    royaltyEstimateMAD: 3800,
    assigned: false,
    distanceKm: 31.2,
  },
  {
    id: "prj-010",
    packCode: "ONG-023-M",
    kw: 10.4,
    phase: "M",
    city: "Tetouan",
    region: "Tanger-Tetouan-Al Hoceima",
    status: "CLOSED",
    deadlineAt: isoDaysFromNow(-4),
    royaltyEstimateMAD: 5900,
    assigned: true,
    distanceKm: 9.4,
  },
];
