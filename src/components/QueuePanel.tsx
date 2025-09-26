import { QueuePanel as QueuePanelData } from "../types/dashboard";

type QueuePanelProps = {
  panel: QueuePanelData;
};

export default function QueuePanel({ panel }: QueuePanelProps) {
  return (
    <article className="glass-panel-strong p-5 space-y-4 text-[12px]">
      <header>
        <p className="font-heading text-[11px] uppercase tracking-[0.3em] text-[color:var(--color-muted)]">
          {panel.kicker}
        </p>
        <h3 className="font-heading text-[20px] font-semibold text-[color:var(--color-text)]">{panel.title}</h3>
        <p className="mt-1 text-[12px] text-[color:var(--color-muted)]">{panel.description}</p>
      </header>
      <ul className="space-y-3">
        {panel.items.map((item) => (
          <li key={`${item.primary}-${item.owner}`} className="glass-panel px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[color:var(--color-text)]">{item.primary}</p>
                <p className="text-[11px] text-[color:var(--color-muted)]">{item.secondary}</p>
              </div>
              <div className="text-right text-[11px] text-[color:var(--color-muted)]">
                <p>{item.meta}</p>
                <p>Owner | {item.owner}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
