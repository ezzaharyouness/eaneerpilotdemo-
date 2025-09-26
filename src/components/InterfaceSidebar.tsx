import type { ReactNode } from "react";

import type { InterfaceKey, InterfaceOption } from "../types/dashboard";

type SecondaryLink = {
  label: string;
  icon: ReactNode;
};

type AccountInfo = {
  name: string;
  role: string;
  email: string;
  initials: string;
};

type InterfaceSidebarProps = {
  options: InterfaceOption[];
  selectedKey: InterfaceKey;
  onSelect: (key: InterfaceKey) => void;
  secondaryLinks: SecondaryLink[];
  account: AccountInfo;
  renderFooter?: (selected: InterfaceKey) => ReactNode;
};

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--color-muted)]">{children}</p>
);

export default function InterfaceSidebar({
  options,
  selectedKey,
  onSelect,
  secondaryLinks,
  account,
  renderFooter,
}: InterfaceSidebarProps) {
  return (
    <aside className="hidden w-[280px] flex-shrink-0 flex-col justify-between px-4 py-6 lg:flex lg:sticky lg:top-10 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(74,92,106,0.28)] shadow-[var(--mainShadow)]">
            <img src="/brand/eaneer-mark.svg" alt="eaneer" className="h-6 w-6" />
          </div>
          <div>
            <p className="font-heading text-[15px] font-semibold text-[color:var(--color-text)]">eaneer</p>
            <p className="text-[11px] text-[color:var(--color-muted)]">Operations suite</p>
          </div>
        </div>

        <div className="space-y-4">
          <SectionLabel>Navigation</SectionLabel>
          <nav className="flex flex-col gap-2">
            {options.map((option) => {
              const isActive = option.key === selectedKey;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => onSelect(option.key)}
                  aria-pressed={isActive}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-[rgba(74,92,106,0.18)] text-[color:var(--color-text)]"
                      : "hover:bg-[rgba(74,92,106,0.10)] text-[color:var(--color-muted)]"
                  }`}
                >
                  <span className="flex items-center gap-3 text-[13px] font-semibold">
                    <span className="flex h-5 w-5 items-center justify-center text-[color:var(--color-accent)]" aria-hidden>
                      {option.icon}
                    </span>
                    {option.label}
                  </span>
                  <span className="badge-pill text-[11px]">
                    {option.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <SectionLabel>Resources</SectionLabel>
          <div className="space-y-2">
            {secondaryLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                aria-label={link.label}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-[12px] text-[color:var(--color-muted)] transition-colors hover:bg-[rgba(74,92,106,0.10)]"
              >
                <span className="flex h-5 w-5 items-center justify-center text-[color:var(--color-accent)]" aria-hidden>
                  {link.icon}
                </span>
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {renderFooter ? renderFooter(selectedKey) : null}
      </div>

      <div className="space-y-4">
        <SectionLabel>Account</SectionLabel>
        <div className="glass-panel flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(74,92,106,0.2)] text-[13px] font-semibold text-[color:var(--color-text)]">
            {account.initials}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[color:var(--color-text)]">{account.name}</p>
            <p className="text-[11px] text-[color:var(--color-muted)]">{account.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}


