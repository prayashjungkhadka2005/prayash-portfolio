import { SAMPLE_TABLES, JoinClause } from "@/features/sql-builder/types";
import { useMemo } from "react";
import HelpTooltip from "./HelpTooltip";

interface ColumnsSelectorProps {
  table: string;
  selectedColumns: string[];
  onChange: (columns: string[]) => void;
  joins?: JoinClause[]; // Optional: to show joined table columns
}

export default function ColumnsSelector({ table, selectedColumns, onChange, joins = [] }: ColumnsSelectorProps) {
  const tableSchema = useMemo(
    () => SAMPLE_TABLES.find(t => t.name === table),
    [table]
  );

  // Get all available tables (base + joined)
  const allTables = useMemo(() => {
    const tables = [{ name: table, schema: tableSchema }];
    if (joins && joins.length > 0) {
      joins.forEach(join => {
        const joinSchema = SAMPLE_TABLES.find(t => t.name === join.table);
        if (joinSchema) {
          tables.push({ name: join.table, schema: joinSchema });
        }
      });
    }
    return tables;
  }, [table, tableSchema, joins]);

  if (!tableSchema) return null;

  const toggleColumn = (column: string) => {
    if (selectedColumns.includes(column)) {
      onChange(selectedColumns.filter(c => c !== column));
    } else {
      onChange([...selectedColumns, column]);
    }
  };

  const selectAll = () => {
    // Select all columns from all tables (base + joined)
    const allColumns: string[] = [];
    allTables.forEach(t => {
      if (t.schema) {
        t.schema.columns.forEach(c => {
          // For joined tables, use prefixed names
          const columnName = joins && joins.length > 0 && t.name !== table
            ? `${t.name}.${c.name}`
            : c.name;
          allColumns.push(columnName);
        });
      }
    });
    onChange(allColumns);
  };

  const deselectAll = () => {
    onChange([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-mono font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-2">
          Select Columns
          <HelpTooltip 
            title="What are Columns?"
            content="Columns are the fields you want to retrieve. For example, if you want user names and emails, select 'name' and 'email' columns. Or select all with 'All' button."
          />
          <span className="text-[10px] px-1.5 py-0.5 bg-foreground/10 text-foreground/60 rounded font-mono">
            {selectedColumns.length}
          </span>
        </label>
        <div className="flex gap-1.5">
          <button
            onClick={selectAll}
            className="text-xs px-2 py-1 bg-foreground/5 hover:bg-foreground/10 active:bg-foreground/15 active:scale-95 text-foreground/60 hover:text-foreground rounded transition-all font-mono"
            aria-label="Select all columns"
          >
            all
          </button>
          <button
            onClick={deselectAll}
            className="text-xs px-2 py-1 bg-foreground/5 hover:bg-foreground/10 active:bg-foreground/15 active:scale-95 text-foreground/60 hover:text-foreground rounded transition-all font-mono"
            aria-label="Deselect all columns"
          >
            clear
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {allTables.map((tbl) => {
          if (!tbl.schema) return null;
          
          const isJoinedTable = tbl.name !== table;
          const prefix = joins && joins.length > 0 && isJoinedTable ? `${tbl.name}.` : '';
          
          return (
            <div key={tbl.name}>
              {/* Table header (only show for joined tables) */}
              {isJoinedTable && (
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-px flex-1 bg-foreground/10" />
                  <span className="text-[10px] font-mono text-foreground/40 uppercase px-2">
                    {tbl.name} table
                  </span>
                  <div className="h-px flex-1 bg-foreground/10" />
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tbl.schema.columns.map((column) => {
                  const columnName = `${prefix}${column.name}`;
                  const isSelected = selectedColumns.includes(columnName);
                  
                  return (
                    <button
                      key={columnName}
                      onClick={() => toggleColumn(columnName)}
                      className={`p-2.5 rounded border transition-all text-left active:scale-95 ${
                        isSelected
                          ? "border-foreground/30 bg-foreground/10"
                          : "border-foreground/10 hover:border-foreground/20 hover:bg-foreground/5"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          isSelected ? "border-foreground bg-foreground" : "border-foreground/20"
                        }`}>
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-foreground truncate font-mono">
                            {isJoinedTable ? columnName : column.name}
                          </div>
                          <div className="text-[10px] text-foreground/40 font-mono">
                            {column.type}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedColumns.length === 0 && (
        <p className="mt-2 text-xs text-foreground/40 font-mono">
          → select columns or use *
        </p>
      )}
    </div>
  );
}

