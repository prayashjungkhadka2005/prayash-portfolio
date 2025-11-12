"use client";

import { ColumnDefinition } from "@/features/sql-builder/types";

interface ColumnTypeIndicatorProps {
  column: ColumnDefinition;
  compact?: boolean;
}

/**
 * ColumnTypeIndicator Component
 * Shows column data type with color coding and icons
 */
export default function ColumnTypeIndicator({ column, compact = false }: ColumnTypeIndicatorProps) {
  // Defensive check for null/undefined
  if (!column || !column.type) {
    return (
      <span className="text-[10px] font-mono text-foreground/40">
        unknown
      </span>
    );
  }

  // Get type category and styling
  const typeInfo = getTypeInfo(column.type);
  
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span 
          className={`text-[10px] font-mono font-semibold ${typeInfo.color}`}
          title={getTypeDescription(column)}
        >
          {column.type}
        </span>
        {!column.nullable && (
          <span 
            className="text-[8px] px-1 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded font-mono font-bold"
            title="Required field"
          >
            *
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5" title={getTypeDescription(column)}>
      {/* Type name */}
      <span className={`text-[10px] font-mono font-semibold ${typeInfo.color}`}>
        {column.type}
      </span>
      
      {/* Required indicator */}
      {!column.nullable && (
        <span 
          className="text-[8px] px-1 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded font-mono font-bold"
          title="Required field"
        >
          *
        </span>
      )}
    </div>
  );
}

/**
 * Get type category information
 */
function getTypeInfo(type: string): { color: string; category: string } {
  const upperType = type.toUpperCase();
  
  // Numeric types
  if (['INTEGER', 'INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'DECIMAL', 'NUMERIC', 'FLOAT', 'DOUBLE', 'REAL'].includes(upperType)) {
    return {
      color: 'text-blue-600 dark:text-blue-400',
      category: 'numeric'
    };
  }
  
  // String types
  if (['VARCHAR', 'CHAR', 'TEXT', 'STRING', 'LONGTEXT', 'MEDIUMTEXT', 'TINYTEXT'].includes(upperType)) {
    return {
      color: 'text-green-600 dark:text-green-400',
      category: 'string'
    };
  }
  
  // Date/Time types
  if (['DATE', 'TIME', 'DATETIME', 'TIMESTAMP', 'YEAR'].includes(upperType)) {
    return {
      color: 'text-purple-600 dark:text-purple-400',
      category: 'datetime'
    };
  }
  
  // Boolean types
  if (['BOOLEAN', 'BOOL', 'BIT'].includes(upperType)) {
    return {
      color: 'text-orange-600 dark:text-orange-400',
      category: 'boolean'
    };
  }
  
  // Binary types
  if (['BLOB', 'BINARY', 'VARBINARY', 'IMAGE'].includes(upperType)) {
    return {
      color: 'text-gray-600 dark:text-gray-400',
      category: 'binary'
    };
  }
  
  // JSON types
  if (['JSON', 'JSONB'].includes(upperType)) {
    return {
      color: 'text-cyan-600 dark:text-cyan-400',
      category: 'json'
    };
  }
  
  // Default/Unknown
  return {
    color: 'text-foreground/60',
    category: 'unknown'
  };
}

/**
 * Get human-readable type description
 */
function getTypeDescription(column: ColumnDefinition): string {
  const typeInfo = getTypeInfo(column.type);
  const required = column.nullable ? 'Optional' : 'Required';
  
  let description = '';
  
  switch (typeInfo.category) {
    case 'numeric':
      description = 'Stores numbers (integers or decimals)';
      break;
    case 'string':
      description = 'Stores text/characters';
      break;
    case 'datetime':
      description = 'Stores dates and/or times';
      break;
    case 'boolean':
      description = 'Stores true/false values';
      break;
    case 'binary':
      description = 'Stores binary data (files, images)';
      break;
    case 'json':
      description = 'Stores JSON structured data';
      break;
    default:
      description = 'Data field';
  }
  
  return `${column.type} - ${description} (${required})`;
}

