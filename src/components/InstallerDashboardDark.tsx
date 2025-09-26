"use client";

import { useMemo, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { ProjectCardGrid, sampleProjects10 } from "./ProjectCards";

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);

type RangeKey = "3m" | "30d" | "7d";

const rangeOptions: { key: RangeKey; label: string }[] = [
  { key: "3m", label: "Last 3 months" },
  { key: "30d", label: "Last 30 days" },
  { key: "7d", label: "Last 7 days" },
];

type ChartDatum = {
  label: string;
  visitors: number;
  installs: number;
};

const chartDataSets: Record<RangeKey, ChartDatum[]> = {
  "3m": [
    { label: "Jul", visitors: 520, installs: 312 },
    { label: "Aug", visitors: 588, installs: 356 },
    { label: "Sep", visitors: 630, installs: 382 },
    { label: "Oct", visitors: 662, installs: 401 },
    { label: "Nov", visitors: 705, installs: 428 },
    { label: "Dec", visitors: 742, installs: 446 },
  ],
  "30d": [
    { label: "Week 1", visitors: 182, installs: 132 },
    { label: "Week 2", visitors: 198, installs: 144 },
    { label: "Week 3", visitors: 214, installs: 153 },
    { label: "Week 4", visitors: 226, installs: 162 },
  ],
  "7d": [
    { label: "Mon", visitors: 62, installs: 48 },
    { label: "Tue", visitors: 64, installs: 49 },
    { label: "Wed", visitors: 68, installs: 51 },
    { label: "Thu", visitors: 71, installs: 53 },
    { label: "Fri", visitors: 74, installs: 56 },
    { label: "Sat", visitors: 58, installs: 44 },
    { label: "Sun", visitors: 52, installs: 39 },
  ],
};
interface ChartTooltipEntry {
  name?: NameType;
  value?: ValueType;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: NameType;
}

type KpiCard = {
  id: string;
  label: string;
  value: string;
  delta: number;
  helper: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  return (
    <div
      className="rounded-xl border px-4 py-3 text-sm shadow-lg"
      style={{
        background: "rgba(17, 33, 45, 0.92)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        color: "var(--color-white)",
        boxShadow: "var(--secShadow)",
      }}
    >
      <p className="text-xs uppercase tracking-wide" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
        {label}
      </p>
      {(payload ?? []).map((entry) => (
        <div key={String(entry.name)} className="flex items-center justify-between gap-3">
          <span className="text-sm" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            {entry.name}
          </span>
          <span className="text-sm font-semibold">
            {typeof entry.value === "number" ? entry.value : Number(entry.value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  );
};

const activeStatuses = new Set(["IN_PROGRESS", "INSTALLING", "TESTING"]);
const closedStatuses = new Set(["TESTING", "VERIFIED", "CLOSED"]);

const median = (values: number[]): number => {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const midpoint = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[midpoint - 1] + sorted[midpoint]) / 2;
  }
  return sorted[midpoint];
};

const InstallerDashboardDark = () => {
  const [range, setRange] = useState<RangeKey>("30d");

  const totalRoyalty = useMemo(
    () =>
      sampleProjects10.reduce((acc, project) => acc + (project.royaltyEstimateMAD ?? 0), 0),
    [],
  );

  const activeAssignments = useMemo(
    () => sampleProjects10.filter((project) => activeStatuses.has(project.status)).length,
    [],
  );

  const qaPassRate = useMemo(() => {
    if (sampleProjects10.length === 0) {
      return 0;
    }
    const verified = sampleProjects10.filter((project) => project.status === "VERIFIED").length;
    return Math.round((verified / sampleProjects10.length) * 100);
  }, []);

  const overdueCount = useMemo(
    () =>
      sampleProjects10.filter((project) => {
        if (!project.deadlineAt || closedStatuses.has(project.status)) {
          return false;
        }
        const deadline = new Date(project.deadlineAt);
        return !Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now();
      }).length,
    [],
  );

  const distances = useMemo(
    () =>
      sampleProjects10
        .map((project) => project.distanceKm)
        .filter((value): value is number => typeof value === "number"),
    [],
  );

  const undoWindows = useMemo(
    () => sampleProjects10.filter((project) => Boolean(project.undoUntil)).length,
    [],
  );

  const chartData = chartDataSets[range];

  const conversionRate = useMemo(() => {
    if (chartData.length === 0) {
      return 0;
    }
    const latestPoint = chartData[chartData.length - 1];
    if (!latestPoint || latestPoint.visitors === 0) {
      return 0;
    }
    return Math.round((latestPoint.installs / latestPoint.visitors) * 100);
  }, [chartData]);

  const visitorsPerInstaller = useMemo(() => {
    if (chartData.length === 0) {
      return 0;
    }
    const latestVisitors = chartData[chartData.length - 1].visitors;
    return Math.round(latestVisitors / Math.max(activeAssignments, 1));
  }, [activeAssignments, chartData]);

  const activeRangeLabel = useMemo(
    () => rangeOptions.find((option) => option.key === range)?.label ?? "Selected range",
    [range],
  );

  const kpis: KpiCard[] = useMemo(
    () => [
      {
        id: "royalty",
        label: "Total Royalty MAD",
        value: formatCurrency(totalRoyalty),
        delta: 4.6,
        helper: "vs previous range",
        icon: TrendingUp,
      },
      {
        id: "active",
        label: "Active Assignments",
        value: activeAssignments.toString(),
        delta: 2.1,
        helper: "Installers currently executing",
        icon: Users,
      },
      {
        id: "qa",
        label: "QA Pass %",
        value: `${qaPassRate}%`,
        delta: 1.4,
        helper: "Verified out of marketplace",
        icon: ShieldCheck,
      },
      {
        id: "overdue",
        label: "Overdue",
        value: overdueCount.toString(),
        delta: -1.3,
        helper: "Projects needing escalation",
        icon: Clock,
      },
    ],
    [activeAssignments, overdueCount, qaPassRate, totalRoyalty],
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em]" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
              Installer control tower
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl" style={{ color: "var(--color-white)" }}>
              Marketplace overview
            </h1>
            <p className="mt-2 max-w-xl text-sm md:text-base" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Track claim velocity, QA conversion, and overdue installs for the crew network. Actions inherit the eaneer
              dark workspace foundations.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {rangeOptions.map((option) => {
              const isActive = option.key === range;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setRange(option.key)}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(105,129,141,0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-superdark)]"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, var(--color-lightgreen), var(--color-primary))"
                      : "rgba(19, 46, 53, 0.48)",
                    color: "var(--color-white)",
                    border: isActive ? "1px solid rgba(255, 255, 255, 0.26)" : "1px solid rgba(255, 255, 255, 0.14)",
                    boxShadow: isActive ? "var(--mainShadow)" : "none",
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const positive = kpi.delta >= 0;
          const Icon = kpi.icon;
          return (
            <article
              key={kpi.id}
              className="flex flex-col justify-between rounded-2xl border p-5 transition duration-150 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(150deg, rgba(17, 33, 45, 0.92), rgba(37, 55, 69, 0.72))",
                borderColor: "rgba(255, 255, 255, 0.08)",
                boxShadow: "var(--secShadow)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="rounded-xl border px-3 py-2"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.12)",
                    background: "rgba(19, 46, 53, 0.48)",
                    color: "var(--color-softgreen)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: positive ? "rgba(16, 185, 129, 0.16)" : "rgba(244, 63, 94, 0.16)",
                    color: positive ? "rgba(16, 185, 129, 0.85)" : "rgba(244, 63, 94, 0.85)",
                    border: positive
                      ? "1px solid rgba(16, 185, 129, 0.32)"
                      : "1px solid rgba(244, 63, 94, 0.32)",
                  }}
                >
                  {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {positive ? "+" : ""}
                  {kpi.delta.toFixed(1)}%
                </span>
              </div>
              <div className="mt-6">
                <h3 className="text-sm uppercase tracking-wide" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {kpi.label}
                </h3>
                <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--color-white)" }}>
                  {kpi.value}
                </p>
                <p className="mt-1 text-xs" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                  {kpi.helper}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[7fr_5fr]">
        <article
          className="flex flex-col rounded-2xl border"
          style={{
            background: "linear-gradient(160deg, rgba(17, 33, 45, 0.94), rgba(37, 55, 69, 0.68))",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "var(--secShadow)",
          }}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5"
            style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--color-white)" }}>
                Conversion velocity
              </h2>
              <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                Visitors and claimed installs for the selected range.
              </p>
            </div>
            <span
              className="hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide md:inline-flex"
              style={{
                borderColor: "rgba(255, 255, 255, 0.16)",
                color: "rgba(255, 255, 255, 0.65)",
              }}
            >
              <BarChart3 className="h-4 w-4" />
              Dual streams
            </span>
          </div>
          <div className="h-[320px] w-full px-2 pb-8 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: 12, right: 20, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(204, 208, 207, 0.9)" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="rgba(204, 208, 207, 0.1)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="installsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(44, 74, 82, 0.9)" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="rgba(44, 74, 82, 0.1)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                  tickLine={false}
                  tick={{ fill: "rgba(255, 255, 255, 0.55)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                  tickLine={false}
                  tick={{ fill: "rgba(255, 255, 255, 0.55)", fontSize: 12 }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255, 255, 255, 0.18)" }} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="rgba(204, 208, 207, 0.9)"
                  strokeWidth={2}
                  fill="url(#visitorsGradient)"
                  fillOpacity={1}
                />
                <Area
                  type="monotone"
                  dataKey="installs"
                  name="Installs"
                  stroke="rgba(44, 74, 82, 0.85)"
                  strokeWidth={2}
                  fill="url(#installsGradient)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside
          className="flex flex-col gap-4 rounded-2xl border p-6"
          style={{
            background: "linear-gradient(165deg, rgba(37, 55, 69, 0.65), rgba(17, 33, 45, 0.92))",
            borderColor: "rgba(255, 255, 255, 0.08)",
            boxShadow: "var(--secShadow)",
          }}
        >
          <h3 className="text-lg font-semibold" style={{ color: "var(--color-white)" }}>
            Crew insights
          </h3>
          <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.68)" }}>
            {activeRangeLabel} highlights a {conversionRate}% conversion of marketplace visitors into claimed installs.
          </p>
          <dl className="space-y-3">
            <div
              className="flex items-center justify-between rounded-xl border px-3 py-3"
              style={{
                borderColor: "rgba(255, 255, 255, 0.12)",
                background: "rgba(17, 33, 45, 0.62)",
                color: "var(--color-white)",
              }}
            >
              <dt className="text-sm" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                Median crew distance
              </dt>
              <dd className="text-sm font-semibold">
                {median(distances).toFixed(1)} km
              </dd>
            </div>
            <div
              className="flex items-center justify-between rounded-xl border px-3 py-3"
              style={{
                borderColor: "rgba(255, 255, 255, 0.12)",
                background: "rgba(17, 33, 45, 0.62)",
                color: "var(--color-white)",
              }}
            >
              <dt className="text-sm" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                Undo windows live
              </dt>
              <dd className="text-sm font-semibold">{undoWindows}</dd>
            </div>
            <div
              className="flex items-center justify-between rounded-xl border px-3 py-3"
              style={{
                borderColor: "rgba(255, 255, 255, 0.12)",
                background: "rgba(17, 33, 45, 0.62)",
                color: "var(--color-white)",
              }}
            >
              <dt className="text-sm" style={{ color: "rgba(255, 255, 255, 0.65)" }}>
                Visitors per installer
              </dt>
              <dd className="text-sm font-semibold">{visitorsPerInstaller}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--color-white)" }}>
              Marketplace preview
            </h2>
            <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.68)" }}>
              10 curated inbound opportunities sourced from eaneer marketplace signals.
            </p>
          </div>
          <span
            className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide"
            style={{
              borderColor: "rgba(255, 255, 255, 0.16)",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          >
            Claim within SLA to retain priority
          </span>
        </div>
        <ProjectCardGrid projects={sampleProjects10} />
      </section>
    </div>
  );
};

export default InstallerDashboardDark;





