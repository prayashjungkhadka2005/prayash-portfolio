/**
 * SQL Syntax Highlighter
 * Provides syntax highlighting for SQL queries
 * Uses regex-based approach (lightweight, no external dependencies)
 */

export interface HighlightedToken {
  text: string;
  type: 'keyword' | 'function' | 'string' | 'number' | 'operator' | 'identifier' | 'comment' | 'default';
}

/**
 * SQL Keywords (case-insensitive)
 */
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
  'LIMIT', 'OFFSET', 'DISTINCT', 'AS', 'IN', 'LIKE',
  'BETWEEN', 'IS', 'NULL', 'EXISTS', 'CASE', 'WHEN', 'THEN',
  'ELSE', 'END', 'UNION', 'ALL', 'CREATE', 'TABLE', 'DROP',
];

/**
 * SQL Functions
 */
const SQL_FUNCTIONS = [
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
  'UPPER', 'LOWER', 'LENGTH', 'SUBSTRING',
  'DATE', 'NOW', 'YEAR', 'MONTH', 'DAY',
  'CONCAT', 'COALESCE', 'CAST', 'ROUND',
];

/**
 * SQL Operators
 */
const SQL_OPERATORS = ['=', '!=', '<>', '>', '<', '>=', '<=', '+', '-', '*', '/'];

/**
 * Tokenize SQL query into highlighted tokens
 */
export function tokenizeSQL(sql: string): HighlightedToken[] {
  if (!sql || sql.trim() === '') {
    return [];
  }

  const tokens: HighlightedToken[] = [];
  let remaining = sql;
  let position = 0;

  while (position < sql.length) {
    let matched = false;

    // Match comments (-- comment)
    if (sql.slice(position, position + 2) === '--') {
      const endOfLine = sql.indexOf('\n', position);
      const commentEnd = endOfLine === -1 ? sql.length : endOfLine;
      tokens.push({
        text: sql.slice(position, commentEnd),
        type: 'comment'
      });
      position = commentEnd;
      matched = true;
      continue;
    }

    // Match strings ('string' or "string")
    if (sql[position] === "'" || sql[position] === '"') {
      const quote = sql[position];
      let end = position + 1;
      while (end < sql.length && sql[end] !== quote) {
        if (sql[end] === '\\' && end + 1 < sql.length) {
          end++; // Skip escaped character (with bounds check)
        }
        end++;
      }
      tokens.push({
        text: sql.slice(position, end + 1),
        type: 'string'
      });
      position = end + 1;
      matched = true;
      continue;
    }

    // Match numbers (123, 45.67)
    if (/\d/.test(sql[position])) {
      let end = position;
      while (end < sql.length && /[\d.]/.test(sql[end])) {
        end++;
      }
      tokens.push({
        text: sql.slice(position, end),
        type: 'number'
      });
      position = end;
      matched = true;
      continue;
    }

    // Match operators
    for (const op of SQL_OPERATORS) {
      if (sql.slice(position, position + op.length) === op) {
        tokens.push({
          text: op,
          type: 'operator'
        });
        position += op.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    // Match keywords, functions, and identifiers
    if (/[a-zA-Z_]/.test(sql[position])) {
      let end = position;
      while (end < sql.length && /[a-zA-Z0-9_.]/.test(sql[end])) {
        end++;
      }
      const word = sql.slice(position, end);
      const upperWord = word.toUpperCase();

      if (SQL_KEYWORDS.includes(upperWord)) {
        tokens.push({ text: word, type: 'keyword' });
      } else if (SQL_FUNCTIONS.includes(upperWord)) {
        tokens.push({ text: word, type: 'function' });
      } else {
        tokens.push({ text: word, type: 'identifier' });
      }
      position = end;
      matched = true;
      continue;
    }

    // Match whitespace and other characters
    if (!matched) {
      tokens.push({
        text: sql[position],
        type: 'default'
      });
      position++;
    }
  }

  return tokens;
}

/**
 * Convert tokens to HTML with Tailwind classes
 */
export function tokensToHTML(tokens: HighlightedToken[]): string {
  return tokens
    .map(token => {
      const colorClass = getColorClass(token.type);
      const escapedText = escapeHTML(token.text);
      return `<span class="${colorClass}">${escapedText}</span>`;
    })
    .join('');
}

/**
 * Get Tailwind color class for token type
 */
function getColorClass(type: HighlightedToken['type']): string {
  switch (type) {
    case 'keyword':
      return 'text-blue-600 dark:text-blue-400 font-semibold';
    case 'function':
      return 'text-purple-600 dark:text-purple-400 font-semibold';
    case 'string':
      return 'text-green-600 dark:text-green-400';
    case 'number':
      return 'text-orange-600 dark:text-orange-400';
    case 'operator':
      return 'text-pink-600 dark:text-pink-400';
    case 'identifier':
      return 'text-foreground/80';
    case 'comment':
      return 'text-foreground/40 italic';
    default:
      return 'text-foreground';
  }
}

/**
 * Escape HTML special characters
 */
function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Highlight SQL query (convenience function)
 */
export function highlightSQL(sql: string): string {
  try {
    if (!sql || sql.trim() === '') return '';
    const tokens = tokenizeSQL(sql);
    return tokensToHTML(tokens);
  } catch (error) {
    // Fallback to plain text if highlighting fails
    console.error('SQL highlighting failed:', error);
    return escapeHTML(sql);
  }
}

