import { Metric, Tone } from "../types/dashboard";

type MetricsGridProps = {
  metrics: Metric[];
  toneToClass: (tone: Tone) => string;
  trendIcon: (trend: "up" | "down") => string;
};

export default function MetricsGrid({ metrics, toneToClass, trendIcon }: MetricsGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="glass-panel p-5">
          <p className="font-heading text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-muted)]">
            {metric.label}
          </p>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="font-heading text-[24px] font-semibold text-[color:var(--color-text)]">{metric.value}</p>
            <span className={`flex items-center gap-1 text-[12px] ${toneToClass(metric.tone)}`}>
              <span aria-hidden>{trendIcon(metric.trend)}</span>
              {metric.change}
            </span>
          </div>
          <p className="mt-3 text-[13px] font-medium text-[color:var(--color-text)]/90">{metric.annotation}</p>
          <p className="text-[11px] text-[color:var(--color-muted)]">{metric.detail}</p>
        </article>
      ))}
    </section>
  );
}
