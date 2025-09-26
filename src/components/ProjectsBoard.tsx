import type { ProjectAssignment } from "../types/dashboard";

type ProjectsBoardProps = {
  assignments: ProjectAssignment[];
  title?: string;
  subtitle?: string;
};

const healthStyles: Record<ProjectAssignment["health"], { color: string }> = {
  "on-track": { color: "rgba(16, 185, 129, 0.85)" },
  "at-risk": { color: "rgba(250, 204, 21, 0.85)" },
  delayed: { color: "rgba(244, 63, 94, 0.85)" },
};

export default function ProjectsBoard({ assignments, title, subtitle }: ProjectsBoardProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-heading text-[11px] uppercase tracking-[0.3em]" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
            Portfolio
          </p>
          <h2 className="font-heading text-[24px] font-semibold" style={{ color: "var(--color-white)" }}>
            {title ?? "Execution portfolio"}
          </h2>
          {subtitle ? (
            <p className="text-[12px]" style={{ color: "rgba(255, 255, 255, 0.68)" }}>
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
      <div
        className="space-y-4 rounded-3xl border p-5"
        style={{
          background: "linear-gradient(150deg, rgba(17, 33, 45, 0.95), rgba(37, 55, 69, 0.7))",
          borderColor: "rgba(255, 255, 255, 0.08)",
          boxShadow: "var(--secShadow)",
        }}
      >
        {assignments.map((assignment) => (
          <article
            key={assignment.id}
            className="rounded-2xl border px-4 py-4"
            style={{
              background: "rgba(17, 33, 45, 0.72)",
              borderColor: "rgba(255, 255, 255, 0.08)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-[18px]" style={{ color: "var(--color-white)" }}>
                  {assignment.title}
                </h3>
                <p className="text-[12px]" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  {assignment.pack} - Owner {assignment.owner}
                </p>
              </div>
              <div className="text-right text-[11px]" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                <p
                  className="font-semibold uppercase tracking-[0.18em]"
                  style={healthStyles[assignment.health]}
                >
                  {assignment.health === "on-track"
                    ? "On Track"
                    : assignment.health === "at-risk"
                      ? "At Risk"
                      : "Delayed"}
                </p>
                <p>{assignment.nextMilestone}</p>
                <p>ETA {assignment.eta}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-[11px] sm:grid-cols-3" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
              <div>
                <p className="uppercase tracking-[0.18em] text-[10px]">Phase</p>
                <p className="mt-1 text-[13px] font-semibold" style={{ color: "var(--color-white)" }}>
                  {assignment.phase}
                </p>
              </div>
              <div>
                <p className="uppercase tracking-[0.18em] text-[10px]">Status</p>
                <p className="mt-1 text-[13px] font-semibold" style={{ color: "var(--color-white)" }}>
                  {assignment.status}
                </p>
              </div>
              <div>
                <p className="uppercase tracking-[0.18em] text-[10px]">Notes</p>
                <p className="mt-1 text-[13px]" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {assignment.notes}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px]" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                <span>Progress</span>
                <span>{assignment.progress}%</span>
              </div>
              <div
                className="mt-2 h-1.5 rounded-full"
                style={{ background: "rgba(255, 255, 255, 0.12)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${assignment.progress}%`,
                    background: "linear-gradient(135deg, var(--color-lightgreen), var(--color-primary))",
                  }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
