"use client";

import { useMemo } from "react";
import { highlightSQL } from "@/features/sql-builder/utils/sql-highlighter";

interface SQLDisplayProps {
  sql: string;
  className?: string;
}

/**
 * SQLDisplay Component
 * Displays SQL with syntax highlighting
 */
export default function SQLDisplay({ sql, className = "" }: SQLDisplayProps) {
  const highlightedHTML = useMemo(() => {
    if (!sql || sql.trim() === '') return '';
    return highlightSQL(sql);
  }, [sql]);

  if (!sql || sql.trim() === '') {
    return (
      <div className={`text-foreground/40 italic font-mono text-sm ${className}`}>
        -- No SQL generated yet
      </div>
    );
  }

  return (
    <pre 
      className={`font-mono text-sm leading-relaxed whitespace-pre-wrap break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: highlightedHTML }}
    />
  );
}

