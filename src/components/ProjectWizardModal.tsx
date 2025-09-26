"use client";
import { useMemo, useState } from "react";

type RoleKind = "CLIENT" | "PARTNER";

type WizardState = {
  role: RoleKind;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  pack: string;
  address: string;
  city: string;
  region: string;
};

type ProjectWizardModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate?: (project: WizardState & { estCostMAD: number; installDays: number; paymentUrl: string }) => void;
};

const packs = [
  { group: "M-Pack", items: ["M-Pack 3kW", "M-Pack 5kW", "M-Pack 10kW", "M-Pack 15kW"] },
  { group: "T-Pack", items: ["T-Pack 8kW", "T-Pack 12kW + Storage"] },
];

const regions = [
  "Casablanca-Settat",
  "Rabat-Sale-Kenitra",
  "Marrakech-Safi",
  "Souss-Massa",
  "Tanger-Tetouan-Al Hoceima",
];

const bufferDaysByRegion: Record<string, number> = {
  "Casablanca-Settat": 2,
  "Rabat-Sale-Kenitra": 2,
  "Marrakech-Safi": 3,
  "Souss-Massa": 3,
  "Tanger-Tetouan-Al Hoceima": 4,
};

function parseKw(pack: string): number {
  const m = pack.match(/(\d+)\s*kW/i);
  return m ? parseInt(m[1], 10) : 5;
}

function hasStorage(pack: string): boolean {
  return /storage/i.test(pack);
}

function computeEstimates(pack: string, region: string) {
  const kw = parseKw(pack);
  const baseDays = Math.ceil(kw / 5); // PRD default 5 kW/day
  const buffer = bufferDaysByRegion[region] ?? 2;
  const installDays = baseDays + buffer;
  const ratePerKw = 7800; // MAD per kW (placeholder)
  const storageAdder = hasStorage(pack) ? 12000 : 0; // placeholder adder
  const estCostMAD = kw * ratePerKw + storageAdder;
  return { installDays, estCostMAD };
}

export default function ProjectWizardModal({ open, onClose, onCreate }: ProjectWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<WizardState>({
    role: "CLIENT",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    pack: "",
    address: "",
    city: "",
    region: "",
  });

  const { installDays, estCostMAD } = useMemo(
    () => computeEstimates(state.pack || "M-Pack 5kW", state.region || regions[0]),
    [state.pack, state.region]
  );

  const canNext1 = state.clientName && (state.clientEmail || state.clientPhone) && state.pack;
  const canNext2 = state.address && state.city && state.region;

  if (!open) return null;

  const closeAndReset = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setState({
        role: "CLIENT",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        pack: "",
        address: "",
        city: "",
        region: "",
      });
    }, 0);
  };

  const handleCreate = () => {
    const paymentUrl = `/pay/${Math.random().toString(36).slice(2, 10)}`;
    onCreate?.({ ...state, estCostMAD, installDays, paymentUrl });
    closeAndReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={closeAndReset} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label="New Project Wizard" className="relative z-10 w-[min(96vw,900px)]">
        <div className="glass-panel-strong overflow-hidden rounded-2xl">
          <header className="flex items-center justify-between border-b border-[rgba(74,92,106,0.25)] px-6 py-4">
            <div>
              <p className="font-heading text-[11px] uppercase tracking-[0.28em] text-[color:var(--color-muted)]">New Project</p>
              <h3 className="font-heading text-[20px] font-semibold">Create and activate</h3>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => {
              const isActive = s <= step;
              return (
                <span
                  key={s}
                  className="h-2 w-8 rounded-full"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, var(--color-lightgreen), var(--color-primary))"
                      : "rgba(255, 255, 255, 0.18)",
                    opacity: isActive ? 1 : 0.5,
                  }}
                />
              );
            })}
            </div>
          </header>

          <div className="grid gap-0 md:grid-cols-[3fr_2fr]">
            <section className="p-6 space-y-6">
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <p className="font-heading text-[12px] uppercase tracking-[0.22em] text-[color:var(--color-muted)]">Owner</p>
                    <div className="mt-2 flex gap-2">
                      {(["CLIENT", "PARTNER"] as RoleKind[]).map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setState((s) => ({ ...s, role }))}
                          className={`btn-pill ${state.role === role ? "btn-pill--active" : ""}`}
                          aria-pressed={state.role === role}
                        >
                          {role === "CLIENT" ? "Client" : "Partner"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-[12px] text-[color:var(--color-muted)]">Name</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-[rgba(74,92,106,0.28)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[rgba(74,92,106,0.6)]"
                        placeholder="e.g. Sarah Amrani"
                        value={state.clientName}
                        onChange={(e) => setState((s) => ({ ...s, clientName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] text-[color:var(--color-muted)]">Email</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-[rgba(74,92,106,0.28)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[rgba(74,92,106,0.6)]"
                        placeholder="client@email.com"
                        type="email"
                        value={state.clientEmail}
                        onChange={(e) => setState((s) => ({ ...s, clientEmail: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] text-[color:var(--color-muted)]">Phone</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-[rgba(74,92,106,0.28)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[rgba(74,92,106,0.6)]"
                        placeholder="+212 ..."
                        value={state.clientPhone}
                        onChange={(e) => setState((s) => ({ ...s, clientPhone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] text-[color:var(--color-muted)]">Pack</label>
                      <select
                        className="mt-1 w-full rounded-xl border border-[rgba(74,92,106,0.28)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[rgba(74,92,106,0.6)]"
                        value={state.pack}
                        onChange={(e) => setState((s) => ({ ...s, pack: e.target.value }))}
                      >
                        <option value="" disabled>
                          Choose a pack
                        </option>
                        {packs.map((g) => (
                          <optgroup key={g.group} label={g.group}>
                            {g.items.map((it) => (
                              <option key={it} value={it}>
                                {it}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="glass-panel p-4 text-[12px]">
                    <p className="text-[color:var(--color-muted)]">BOM preview</p>
                    <ul className="mt-2 list-disc pl-5 text-[color:var(--color-text)]/90">
                      <li>Panels: {parseKw(state.pack || "M-Pack 5kW")} kW array</li>
                      <li>Inverter: matched to pack size</li>
                      <li>Storage: {hasStorage(state.pack) ? "Yes" : "No"}</li>
                    </ul>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-[12px] text-[color:var(--color-muted)]">Address</label>
                      <input
                        className="mt-1 w-full rounded-xl border border-[rgba(74,92,106,0.28)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[rgba(74,92,106,0.6)]"
                        placeholder="Street, number, area"
                        value={state.address}
                        onChange={(e) => setState((s) => ({ ...s, address: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-[12px] text-[color:var(--color-muted)]">City</label>
                        <input
                          className="mt-1 w-full rounded-xl border border-[rgba(74,92,106,0.28)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[rgba(74,92,106,0.6)]"
                          placeholder="e.g. Casablanca"
                          value={state.city}
                          onChange={(e) => setState((s) => ({ ...s, city: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] text-[color:var(--color-muted)]">Region</label>
                        <select
                          className="mt-1 w-full rounded-xl border border-[rgba(74,92,106,0.28)] bg-transparent px-3 py-2 text-[13px] outline-none focus:border-[rgba(74,92,106,0.6)]"
                          value={state.region}
                          onChange={(e) => setState((s) => ({ ...s, region: e.target.value }))}
                        >
                          <option value="" disabled>
                            Choose region
                          </option>
                          {regions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="glass-panel p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">Pack</p>
                      <p className="mt-1 text-[13px] font-semibold">{state.pack || "--"}</p>
                    </div>
                    <div className="glass-panel p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">Location</p>
                      <p className="mt-1 text-[13px] font-semibold">{state.city || "--"}, {state.region || "--"}</p>
                    </div>
                    <div className="glass-panel p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">ETA</p>
                      <p className="mt-1 text-[13px] font-semibold">{installDays} days</p>
                    </div>
                  </div>
                  <div className="glass-panel p-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">Estimated price</p>
                    <p className="mt-1 text-[18px] font-semibold">MAD {estCostMAD.toLocaleString()}</p>
                    <p className="text-[12px] text-[color:var(--color-muted)]">Online payment required to activate (PRD rule).</p>
                  </div>
                </div>
              )}
            </section>

            <aside className="border-l border-[rgba(74,92,106,0.25)] p-6 space-y-4">
              <div className="glass-panel p-4 text-[12px]">
                <p className="text-[color:var(--color-muted)]">Flow</p>
                <ol className="mt-2 list-decimal pl-5">
                  <li>Choose owner & pack</li>
                  <li>Set location (city, region)</li>
                  <li>Review, create, pay</li>
                </ol>
              </div>
              <div className="text-[12px] text-[color:var(--color-muted)]">
                <p>Business rules:</p>
                <ul className="mt-2 list-disc pl-5">
                  <li>Payment moves status to Active.</li>
                  <li>Exactly one installer & supplier lock.</li>
                  <li>30-min undo after claim.</li>
                </ul>
              </div>
            </aside>
          </div>

          <footer className="flex items-center justify-between border-t border-[rgba(74,92,106,0.25)] px-6 py-4">
            <div className="text-[12px] text-[color:var(--color-muted)]">
              Step {step} of 3
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="btn-pill" onClick={closeAndReset}>Cancel</button>
              {step > 1 && (
                <button type="button" className="btn-pill" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>
                  Back
                </button>
              )}
              {step < 3 && (
                <button
                  type="button"
                  className={`btn-primary ${step === 1 && !canNext1 ? "opacity-60 cursor-not-allowed" : ""} ${
                    step === 2 && !canNext2 ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
                  onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                >
                  Next
                </button>
              )}
              {step === 3 && (
                <button type="button" className="btn-primary" onClick={handleCreate}>
                  Create project & generate payment link
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}















