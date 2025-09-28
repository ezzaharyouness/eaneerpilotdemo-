import { RangeInsights, RangeKey, RangeOption, TimelinePoint, Tone } from "../types/dashboard";

type ThroughputPanelProps = {
  timelineData: TimelinePoint[];
  rangeOptions: RangeOption[];
  selectedRange: RangeKey;
  onSelectRange: (key: RangeKey) => void;
  insights: RangeInsights;
  toneToClass: (tone: Tone) => string;
};

const areaConfig = {
  width: 800,
  height: 220,
};

const buildAreaPath = (values: number[]) => {
  if (values.length === 0) {
    return "";
  }

  const maxValue = Math.max(...values);
  if (maxValue === 0) {
    return "";
  }

  const step = values.length > 1 ? areaConfig.width / (values.length - 1) : areaConfig.width;
  const verticalPadding = 16;
  const scale = (areaConfig.height - verticalPadding) / maxValue;

  let path = `M 0 ${areaConfig.height}`;
  path += ` L 0 ${areaConfig.height - values[0] * scale}`;

  values.slice(1).forEach((value, index) => {
    const x = step * (index + 1);
    const y = areaConfig.height - value * scale;
    path += ` L ${x} ${y}`;
  });

  path += ` L ${areaConfig.width} ${areaConfig.height} Z`;
  return path;
};

export default function ThroughputPanel({
  timelineData,
  rangeOptions,
  selectedRange,
  onSelectRange,
  insights,
  toneToClass,
}: ThroughputPanelProps) {
  const activePath = buildAreaPath(timelineData.map((point) => point.active));
  const verifiedPath = buildAreaPath(timelineData.map((point) => point.verified));

  return (
    <article className="glass-panel-strong p-6 space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-[11px] uppercase tracking-[0.32em] text-[color:var(--color-muted)]">
            Platform Throughput
          </p>
          <h2 className="font-heading text-[24px] font-semibold text-[color:var(--color-text)]">
            Active -&gt; Verified pipeline
          </h2>
          <p className="mt-1 text-[13px] text-[color:var(--color-muted)]">
            Monitoring cadence from payment activation to QA verification across selected timeframe.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {rangeOptions.map((option) => {
            const isActive = option.key === selectedRange;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onSelectRange(option.key)}
                aria-pressed={isActive}
                className={`btn-pill ${isActive ? "btn-pill--active" : ""}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </header>
      <div className="glass-panel p-5">
        <svg
          viewBox={`0 0 ${areaConfig.width} ${areaConfig.height}`}
          role="img"
          aria-labelledby="throughput-chart-title"
          className="h-64 w-full"
        >
          <title id="throughput-chart-title">
            Area chart showing active and verified project counts across the selected range
          </title>
          <defs>
            <linearGradient id="activeGradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#2C4A52E6" />
              <stop offset="100%" stopColor="#2C4A520D" />
            </linearGradient>
            <linearGradient id="verifiedGradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#4A5C6ACC" />
              <stop offset="100%" stopColor="#4A5C6A0D" />
            </linearGradient>
          </defs>
          <path d={activePath} fill="url(#activeGradient)" stroke="#2C4A52CC" strokeWidth="2" />
          <path d={verifiedPath} fill="url(#verifiedGradient)" stroke="#4A5C6ACC" strokeWidth="2" />
          {timelineData.map((point, index) => {
            const x =
              timelineData.length === 1
                ? 0
                : (areaConfig.width / (timelineData.length - 1)) * index;
            return (
              <text
                key={`${point.label}-${index}`}
                x={x}
                y={areaConfig.height + 18}
                fill="#94a3b8"
                fontSize="13"
                textAnchor="middle"
              >
                {point.label}
              </text>
            );
          })}
        </svg>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              Activation speed
            </p>
            <p className="mt-2 text-[18px] font-semibold text-[color:var(--color-text)]">
              {insights.activation.value}
            </p>
            <p className="text-[12px] text-[color:var(--color-muted)]">{insights.activation.caption}</p>
          </div>
          <div>
            <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              QA first pass
            </p>
            <p className="mt-2 text-[18px] font-semibold text-[color:var(--color-text)]">{insights.qa.value}</p>
            <p className="text-[12px] text-[color:var(--color-muted)]">{insights.qa.caption}</p>
          </div>
          <div>
            <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
              Deadline breaches
            </p>
            <p className={`mt-2 text-[18px] font-semibold ${toneToClass(insights.breaches.tone)}`}>
              {insights.breaches.value}
            </p>
            <p className="text-[12px] text-[color:var(--color-muted)]">{insights.breaches.caption}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
