import { ClaimPanel as ClaimPanelData, Tone } from "../types/dashboard";

type ClaimsPanelProps = {
  panel: ClaimPanelData;
  secondaryToneToClass: (tone: Tone) => string;
};

export default function ClaimsPanel({ panel, secondaryToneToClass }: ClaimsPanelProps) {
  return (
    <article className="glass-panel-strong p-5 space-y-4">
      <header>
        <p className="font-heading text-[11px] uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
          {panel.kicker}
        </p>
        <h3 className="font-heading text-[20px] font-semibold text-[color:var(--color-text)]">{panel.title}</h3>
        <p className="mt-1 text-[12px] text-[color:var(--color-muted)]">{panel.description}</p>
      </header>
      <div className="space-y-4">
        {panel.items.map((item) => (
          <div key={item.title} className="glass-panel space-y-3 p-4">
            <div className="flex items-center justify-between text-[12px] text-[color:var(--color-muted)]">
              <span className="font-heading uppercase tracking-[0.2em] text-[11px] text-[color:var(--color-text)]">
                {item.title}
              </span>
              <span className="badge-pill badge-pill--accent">{item.chipLabel} {item.chipValue}</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-[color:var(--color-muted)]">{item.primaryLabel}</p>
                <p className="text-[20px] font-semibold text-[color:var(--color-text)]">{item.primaryValue}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[color:var(--color-muted)]">{item.secondaryLabel}</p>
                <p className={`text-[16px] font-semibold ${secondaryToneToClass(item.secondaryTone)}`}>
                  {item.secondaryValue}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
