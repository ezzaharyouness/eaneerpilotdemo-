import { StatusPanel as StatusPanelData, Tone } from "../types/dashboard";

type StatusPanelProps = {
  panel: StatusPanelData;
  toneToClass: (tone: Tone) => string;
};

export default function StatusPanel({ panel, toneToClass }: StatusPanelProps) {
  return (
    <article className="glass-panel-strong p-5 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="font-heading text-[11px] uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
            {panel.kicker}
          </p>
          <h3 className="font-heading text-[20px] font-semibold text-[color:var(--color-text)]">{panel.title}</h3>
        </div>
        <span className="badge-pill badge-pill--accent">{panel.badge}</span>
      </header>
      <ul className="space-y-3">
        {panel.items.map((item) => (
          <li key={item.status} className="glass-panel px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[color:var(--color-text)]">{item.status}</p>
                <p className="text-[11px] text-[color:var(--color-muted)]">{item.note}</p>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-semibold text-[color:var(--color-text)]">{item.count}</p>
                <p className={`text-[12px] ${toneToClass(item.tone)}`}>{item.delta}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
