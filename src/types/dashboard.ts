import type { ReactNode } from "react";

export type Trend = "up" | "down";
export type Tone = "positive" | "negative" | "neutral";
export type InterfaceKey = "dashboard" | "installers" | "suppliers" | "projects" | "qa" | "partners";
export type RangeKey = "90d" | "30d" | "7d";

export type InterfaceOption = {
  key: InterfaceKey;
  label: string;
  badge: string;
  description: string;
  icon: ReactNode;
};

export type Metric = {
  label: string;
  value: string;
  change: string;
  trend: Trend;
  tone: Tone;
  annotation: string;
  detail: string;
};

export type TimelinePoint = {
  label: string;
  active: number;
  verified: number;
};

export type StatusItem = {
  status: string;
  count: number;
  delta: string;
  tone: Tone;
  note: string;
};

export type StatusPanel = {
  kicker: string;
  title: string;
  badge: string;
  items: StatusItem[];
};

export type ClaimPanelItem = {
  title: string;
  chipLabel: string;
  chipValue: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  secondaryTone: Tone;
};

export type ClaimPanel = {
  kicker: string;
  title: string;
  description: string;
  items: ClaimPanelItem[];
};

export type QueueItem = {
  primary: string;
  secondary: string;
  meta: string;
  owner: string;
};

export type QueuePanel = {
  kicker: string;
  title: string;
  description: string;
  items: QueueItem[];
};

export type RangeOption = {
  key: RangeKey;
  label: string;
};

export type RangeInsights = {
  activation: { value: string; caption: string };
  qa: { value: string; caption: string };
  breaches: { value: string; caption: string; tone: Tone };
};

export type MarketplaceProject = {
  id: string;
  client: string;
  pack: string;
  city: string;
  region: string;
  statusKey: "active" | "equipment" | "testing" | "ready";
  statusLabel: string;
  deadline: string;
  claimState: "Open" | "Locked";
  undoWindow?: string;
  installer?: string;
  supplier?: string;
  progress: number;
  tags: string[];
  highlight: string;
};

export type MarketplaceFilter = {
  key: MarketplaceProject["statusKey"] | "all";
  label: string;
};

export type ProjectAssignment = {
  id: string;
  title: string;
  pack: string;
  owner: string;
  phase: string;
  status: string;
  nextMilestone: string;
  eta: string;
  progress: number;
  health: "on-track" | "at-risk" | "delayed";
  notes: string;
};
