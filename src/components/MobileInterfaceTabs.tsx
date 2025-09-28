import { InterfaceKey, InterfaceOption } from "../types/dashboard";

type MobileInterfaceTabsProps = {
  options: InterfaceOption[];
  selectedKey: InterfaceKey;
  onSelect: (key: InterfaceKey) => void;
};

export default function MobileInterfaceTabs({ options, selectedKey, onSelect }: MobileInterfaceTabsProps) {
  return (
    <div className="lg:hidden">
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {options.map((option) => {
          const isActive = option.key === selectedKey;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              aria-pressed={isActive}
              className={`btn-pill ${isActive ? "btn-pill--active" : ""}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
