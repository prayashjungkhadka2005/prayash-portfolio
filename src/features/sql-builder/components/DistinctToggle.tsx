"use client";

import HelpTooltip from "./HelpTooltip";

interface DistinctToggleProps {
  value: boolean;
  onChange: (distinct: boolean) => void;
}

export default function DistinctToggle({ value, onChange }: DistinctToggleProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-mono font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Unique Rows (DISTINCT)
          <HelpTooltip 
            title="How DISTINCT Works"
            content="DISTINCT compares the ENTIRE row. If selecting name and email, each name+email combination must be unique. If selecting name, email, and total, each name+email+total combination must be unique. Tip: To see unique users, select only user columns (not varying values like order amounts)."
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-full p-4 rounded border transition-all text-left active:scale-95 ${
          value
            ? "border-primary/30 bg-primary/10 hover:bg-primary/15"
            : "border-foreground/10 hover:border-foreground/20 hover:bg-foreground/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              value ? "border-primary bg-primary" : "border-foreground/30"
            }`}>
              {value && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground font-mono">
                {value ? "Remove Duplicates (DISTINCT)" : "Allow Duplicates"}
              </p>
              <p className="text-[10px] text-foreground/50 font-mono mt-0.5">
                {value 
                  ? "Only unique rows will be returned" 
                  : "All rows returned (may include duplicates)"}
              </p>
            </div>
          </div>
          {value && (
            <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-mono font-bold rounded">
              ON
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

