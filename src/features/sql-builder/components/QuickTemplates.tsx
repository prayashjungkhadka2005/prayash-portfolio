import { QueryState } from "@/features/sql-builder/types";
import { ALL_TEMPLATES } from "@/features/sql-builder/data/template-definitions";
import { useState } from "react";

interface QuickTemplatesProps {
  onLoadTemplate: (state: Partial<QueryState>) => void;
}

export default function QuickTemplates({ onLoadTemplate }: QuickTemplatesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Import all templates from centralized definitions
  const allTemplates = ALL_TEMPLATES;

  // Unified monochrome style for all templates
  const templateStyle = {
    bg: "bg-foreground/5",
    border: "border-foreground/10",
    icon: "text-foreground/60",
    hover: "hover:bg-foreground/10",
  };

  return (
    <div className="mb-8">
      {/* Clean Backend Style */}
      <div className="relative p-5 sm:p-6 bg-white dark:bg-[#1a1a1a] border border-foreground/10 rounded-lg">
        {/* Header */}
        <div className="mb-5 pb-4 border-b border-foreground/10">
          <div className="flex items-center gap-2.5 mb-2">
            <svg className="w-4 h-4 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 17a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 17a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" />
            </svg>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Learning Templates
            </h3>
          </div>
          <p className="text-xs text-foreground/40 font-mono">
            → learn by example • organized by difficulty
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(isExpanded ? allTemplates : allTemplates.slice(0, 4)).map((template, idx) => (
            <button
              key={idx}
              onClick={() => onLoadTemplate(template.state)}
              className={`group relative p-4 bg-[#fafafa] dark:bg-black/40 border ${templateStyle.border} ${templateStyle.hover} hover:border-foreground/20 active:scale-95 active:bg-foreground/10 rounded transition-all text-left`}
            >
              {/* Difficulty Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  template.difficulty === "Beginner" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                  template.difficulty === "Intermediate" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                  template.difficulty === "Expert" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" :
                  "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                }`}>
                  {template.difficulty}
                </span>
              </div>

              <div className="relative">
                <div className={`inline-flex w-9 h-9 rounded border ${templateStyle.border} items-center justify-center mb-3 ${templateStyle.icon}`}>
                  {template.icon}
                </div>
                <h4 className="text-xs font-semibold text-foreground mb-1 font-mono">
                  {template.name}
                </h4>
                <p className="text-[10px] text-foreground/50 font-mono leading-relaxed">
                  {template.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Show More/Less Button */}
        {allTemplates.length > 4 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 active:bg-foreground/15 active:scale-95 border border-foreground/10 hover:border-foreground/20 text-foreground rounded-lg transition-all flex items-center gap-2 mx-auto text-xs font-mono"
            >
              <span>{isExpanded ? 'Show Less' : `Show All ${allTemplates.length} Templates`}</span>
              <svg 
                className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
