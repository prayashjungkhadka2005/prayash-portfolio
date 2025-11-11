import { QueryState } from "@/features/sql-builder/types";

/**
 * Generate SQL query from QueryState
 * Following SQL best practices and formatting
 */
export function generateSQL(state: QueryState): string {
  if (!state.table) {
    return "-- Select a table to start building your query";
  }

  switch (state.queryType) {
    case "SELECT":
      return generateSelectQuery(state);
    case "INSERT":
      return generateInsertQuery(state);
    case "UPDATE":
      return "-- UPDATE query builder coming soon!";
    case "DELETE":
      return "-- DELETE query builder coming soon!";
    default:
      return "";
  }
}

/**
 * Generate SELECT query
 */
function generateSelectQuery(state: QueryState): string {
  const parts: string[] = [];

  // SELECT clause
  let selectClause = "SELECT";
  
  // Add DISTINCT if enabled
  if (state.distinct) {
    selectClause += " DISTINCT";
  }
  
  // Build column/aggregate list
  const selectItems: string[] = [];
  
  // Add aggregate functions
  if (state.aggregates.length > 0) {
    state.aggregates.forEach(agg => {
      const aggStr = agg.alias 
        ? `${agg.function}(${agg.column}) AS ${agg.alias}`
        : `${agg.function}(${agg.column})`;
      selectItems.push(aggStr);
    });
  }
  
  // Add regular columns
  if (state.columns.length > 0) {
    selectItems.push(...state.columns);
  }
  
  // If no columns or aggregates, use *
  const columns = selectItems.length > 0 ? selectItems.join(", ") : "*";
  parts.push(`${selectClause} ${columns}`);

  // FROM clause
  parts.push(`FROM ${state.table}`);

  // JOIN clauses
  if (state.joins && state.joins.length > 0) {
    state.joins.forEach(join => {
      if (join.table && join.onLeft && join.onRight) {
        parts.push(`${join.type} JOIN ${join.table} ON ${join.onLeft} = ${join.onRight}`);
      }
    });
  }

  // WHERE clause
  if (state.whereConditions.length > 0) {
    const whereParts: string[] = [];
    state.whereConditions.forEach((condition, index) => {
      const valueFormatted = formatValue(condition.operator, condition.value);
      const clause = `${condition.column} ${condition.operator} ${valueFormatted}`;
      
      if (index === 0) {
        whereParts.push(clause);
      } else {
        whereParts.push(`  ${condition.conjunction} ${clause}`);
      }
    });
    parts.push(`WHERE ${whereParts.join("\n")}`);
  }

  // GROUP BY clause
  if (state.groupBy.length > 0) {
    parts.push(`GROUP BY ${state.groupBy.join(", ")}`);
  }

  // HAVING clause
  if (state.having.length > 0) {
    const havingParts: string[] = [];
    state.having.forEach((condition, index) => {
      const aggFunc = `${condition.function}(${condition.column})`;
      const clause = `${aggFunc} ${condition.operator} ${condition.value}`;
      
      if (index === 0) {
        havingParts.push(clause);
      } else {
        havingParts.push(`  ${condition.conjunction} ${clause}`);
      }
    });
    parts.push(`HAVING ${havingParts.join("\n")}`);
  }

  // ORDER BY clause
  if (state.orderBy.length > 0) {
    const orderParts = state.orderBy.map(
      order => `${order.column} ${order.direction}`
    );
    parts.push(`ORDER BY ${orderParts.join(", ")}`);
  }

  // LIMIT clause
  if (state.limit !== null && state.limit > 0) {
    parts.push(`LIMIT ${state.limit}`);
  }

  // OFFSET clause
  if (state.offset !== null && state.offset > 0) {
    parts.push(`OFFSET ${state.offset}`);
  }

  // Join with proper indentation
  return parts.join("\n") + ";";
}

/**
 * Format value based on operator
 */
function formatValue(operator: string, value: string): string {
  // IS NULL / IS NOT NULL don't need values
  if (operator.includes("NULL")) {
    return "";
  }

  // IN / NOT IN need parentheses
  if (operator.includes("IN")) {
    return `(${value})`;
  }

  // LIKE keeps quotes
  if (operator === "LIKE") {
    return `'${value}'`;
  }

  // Number detection (simple)
  if (!isNaN(Number(value)) && value.trim() !== "") {
    return value;
  }

  // Default: string with quotes
  return `'${value}'`;
}

/**
 * Explain query in plain English
 */
export function explainQuery(state: QueryState): string {
  if (!state.table) {
    return "No query to explain yet. Start by selecting a table.";
  }

  const parts: string[] = [];

  // Main action
  if (state.queryType === "SELECT") {
    // Handle aggregates
    if (state.aggregates.length > 0) {
      const aggDescriptions = state.aggregates.map(agg => {
        const funcName = agg.function.toLowerCase();
        const colName = agg.column === "*" ? "all rows" : `the ${agg.column} column`;
        return `${funcName}s ${colName}`;
      });
      parts.push(`This query calculates: ${aggDescriptions.join(", ")}.`);
      
      if (state.columns.length > 0) {
        parts.push(`It also selects: ${state.columns.join(", ")}.`);
      }
    } else {
      const columns = state.columns.length > 0 
        ? state.columns.join(", ") 
        : "all columns";
      const distinct = state.distinct ? "unique " : "";
      parts.push(`This query retrieves ${distinct}${columns} from the "${state.table}" table.`);
    }
    
    // JOIN explanation
    if (state.joins && state.joins.length > 0) {
      const joinDescriptions = state.joins.map(join => {
        const joinType = join.type === "INNER" ? "matching rows from" : 
                        join.type === "LEFT" ? "all rows from base table and matching rows from" :
                        join.type === "RIGHT" ? "all rows from joined table and matching rows from" :
                        "all rows from both";
        return `${join.type} JOIN with "${join.table}" (${joinType})`;
      });
      parts.push(`\nJoins: ${joinDescriptions.join(", ")}.`);
    }
  } else if (state.queryType === "INSERT") {
    const filledColumns = Object.keys(state.insertValues).filter(col => state.insertValues[col] && state.insertValues[col].trim() !== '');
    
    if (filledColumns.length === 0) {
      parts.push(`This query will insert a new row into the "${state.table}" table.`);
      parts.push("\nFill in the column values to complete the INSERT statement.");
    } else {
      parts.push(`This query inserts a new row into the "${state.table}" table.`);
      parts.push(`\nIt sets ${filledColumns.length} column${filledColumns.length > 1 ? 's' : ''}:`);
      filledColumns.forEach(col => {
        const value = state.insertValues[col];
        const displayValue = value.length > 50 ? value.substring(0, 50) + '...' : value;
        parts.push(`  • ${col} = ${displayValue}`);
      });
    }
  }

  // WHERE conditions
  if (state.whereConditions.length > 0) {
    parts.push("\nIt filters rows where:");
    state.whereConditions.forEach((condition, index) => {
      const conjunction = index > 0 ? condition.conjunction.toLowerCase() : "";
      const operator = operatorToEnglish(condition.operator);
      parts.push(`  ${conjunction} ${condition.column} ${operator} ${condition.value || "(null)"}`.trim());
    });
  }

  // GROUP BY
  if (state.groupBy.length > 0) {
    parts.push(`\nResults are grouped by: ${state.groupBy.join(", ")}.`);
  }

  // HAVING
  if (state.having.length > 0) {
    parts.push("\nGroups are filtered where:");
    state.having.forEach((condition, index) => {
      const conjunction = index > 0 ? condition.conjunction.toLowerCase() : "";
      const aggFunc = `${condition.function}(${condition.column})`;
      parts.push(`  ${conjunction} ${aggFunc} ${condition.operator} ${condition.value}`.trim());
    });
  }

  // ORDER BY
  if (state.orderBy.length > 0) {
    const orderDesc = state.orderBy.map((o, idx) => {
      const direction = o.direction === "ASC" ? "ascending" : "descending";
      return idx === 0 ? `${o.column} (${direction})` : `then by ${o.column} (${direction})`;
    }).join(", ");
    parts.push(`\nResults are sorted by ${orderDesc}.`);
  }

  // LIMIT/OFFSET (only for SELECT queries)
  if (state.queryType === "SELECT") {
    if (state.limit !== null && state.limit > 0) {
      parts.push(`\nIt returns up to ${state.limit} results.`);
      if (state.offset !== null && state.offset > 0) {
        parts.push(` Starting from record #${state.offset + 1} (skipping first ${state.offset}).`);
      }
    } else {
      parts.push(`\nNote: Preview shows first 20 rows by default. Add LIMIT to control this.`);
      if (state.offset !== null && state.offset > 0) {
        parts.push(` Starting from record #${state.offset + 1} (skipping first ${state.offset}).`);
      }
    }
  }

  return parts.join("\n");
}

/**
 * Convert operator to plain English
 */
function operatorToEnglish(operator: string): string {
  const map: Record<string, string> = {
    "=": "equals",
    "!=": "does not equal",
    ">": "is greater than",
    "<": "is less than",
    ">=": "is greater than or equal to",
    "<=": "is less than or equal to",
    "LIKE": "matches pattern",
    "IN": "is in",
    "NOT IN": "is not in",
    "IS NULL": "is null",
    "IS NOT NULL": "is not null",
  };
  return map[operator] || operator;
}

/**
 * Generate INSERT query
 */
function generateInsertQuery(state: QueryState): string {
  const parts: string[] = [];
  
  // Get columns and values
  const columns = Object.keys(state.insertValues).filter(col => state.insertValues[col] && state.insertValues[col].trim() !== '');
  
  if (columns.length === 0) {
    return `-- INSERT INTO ${state.table}\n-- Add values to insert a new row`;
  }
  
  const values = columns.map(col => {
    const value = state.insertValues[col];
    // Format value based on type
    if (value === 'NULL' || value === 'null') {
      return 'NULL';
    }
    // Check if it's a number
    if (!isNaN(Number(value)) && value.trim() !== "") {
      return value;
    }
    // Check if it's a boolean
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      return value.toUpperCase();
    }
    // Default: string with quotes (escape single quotes)
    return `'${value.replace(/'/g, "''")}'`;
  });
  
  // INSERT INTO table (columns)
  parts.push(`INSERT INTO ${state.table} (${columns.join(", ")})`);
  
  // VALUES (values)
  parts.push(`VALUES (${values.join(", ")})`);
  
  return parts.join("\n") + ";";
}

