/**
 * JOIN Executor for Mock Data
 * Handles INNER, LEFT, RIGHT, and FULL JOINs
 */

import { JoinClause } from '@/features/sql-builder/types';
import { getMockData } from './index';

/**
 * Execute JOIN operations on mock data
 */
export function executeJoins(
  baseTable: string,
  joins: JoinClause[]
): any[] {
  if (!joins || joins.length === 0) {
    // No joins - return base table data
    return getMockData(baseTable);
  }

  // Start with base table data
  let result = getMockData(baseTable).map(row => ({
    ...prefixColumns(row, baseTable)
  }));

  // Apply each JOIN sequentially
  joins.forEach(join => {
    if (!join.table || !join.onLeft || !join.onRight) {
      return; // Skip incomplete joins
    }

    const joinTable = getMockData(join.table);
    result = performJoin(result, joinTable, join, baseTable);
  });

  return result;
}

/**
 * Prefix all column names with table name
 */
function prefixColumns(row: any, tableName: string): any {
  const prefixed: any = {};
  Object.keys(row).forEach(key => {
    prefixed[`${tableName}.${key}`] = row[key];
  });
  return prefixed;
}

/**
 * Extract column value handling both prefixed and non-prefixed
 */
export function getColumnValue(row: any, column: string): any {
  // If column has table prefix, use it directly
  if (column.includes('.')) {
    return row[column];
  }
  
  // Otherwise, try to find it in any table prefix
  const keys = Object.keys(row);
  for (const key of keys) {
    if (key.endsWith(`.${column}`)) {
      return row[key];
    }
  }
  
  // Fallback: exact match
  return row[column];
}

/**
 * Perform a single JOIN operation
 */
function performJoin(
  leftData: any[],
  rightData: any[],
  join: JoinClause,
  baseTable: string
): any[] {
  const result: any[] = [];
  
  // Handle empty tables
  if (leftData.length === 0 && rightData.length === 0) {
    return []; // Both empty = no results
  }
  
  const rightDataPrefixed = rightData.map(row => prefixColumns(row, join.table));

  switch (join.type) {
    case 'INNER':
      // INNER JOIN: Only matching rows
      // If either table is empty, result is empty (correct behavior)
      leftData.forEach(leftRow => {
        rightDataPrefixed.forEach(rightRow => {
          if (matchesJoinCondition(leftRow, rightRow, join.onLeft, join.onRight)) {
            result.push({ ...leftRow, ...rightRow });
          }
        });
      });
      break;

    case 'LEFT':
      // LEFT JOIN: All left rows + matching right rows
      // If right table is empty, return all left rows with NULL for right columns
      if (rightDataPrefixed.length === 0) {
        return leftData; // All left rows, no right columns to add
      }
      
      leftData.forEach(leftRow => {
        let matched = false;
        rightDataPrefixed.forEach(rightRow => {
          if (matchesJoinCondition(leftRow, rightRow, join.onLeft, join.onRight)) {
            result.push({ ...leftRow, ...rightRow });
            matched = true;
          }
        });
        // If no match, add left row with NULL for right columns
        if (!matched) {
          const nullRight = createNullRow(rightDataPrefixed[0]);
          result.push({ ...leftRow, ...nullRight });
        }
      });
      break;

    case 'RIGHT':
      // RIGHT JOIN: All right rows + matching left rows
      // If left table is empty, return all right rows with NULL for left columns
      if (leftData.length === 0) {
        return rightDataPrefixed; // All right rows, no left columns to add
      }
      
      rightDataPrefixed.forEach(rightRow => {
        let matched = false;
        leftData.forEach(leftRow => {
          if (matchesJoinCondition(leftRow, rightRow, join.onLeft, join.onRight)) {
            result.push({ ...leftRow, ...rightRow });
            matched = true;
          }
        });
        // If no match, add right row with NULL for left columns
        if (!matched) {
          const nullLeft = createNullRow(leftData[0]);
          result.push({ ...nullLeft, ...rightRow });
        }
      });
      break;

    case 'FULL':
      // FULL JOIN: All rows from both tables
      // Handle edge cases for empty tables
      if (leftData.length === 0) {
        return rightDataPrefixed; // Only right data exists
      }
      if (rightDataPrefixed.length === 0) {
        return leftData; // Only left data exists
      }
      
      const matchedLeftIndices = new Set<number>();
      const matchedRightIndices = new Set<number>();

      leftData.forEach((leftRow, leftIdx) => {
        rightDataPrefixed.forEach((rightRow, rightIdx) => {
          if (matchesJoinCondition(leftRow, rightRow, join.onLeft, join.onRight)) {
            result.push({ ...leftRow, ...rightRow });
            matchedLeftIndices.add(leftIdx);
            matchedRightIndices.add(rightIdx);
          }
        });
      });

      // Add unmatched left rows
      leftData.forEach((leftRow, idx) => {
        if (!matchedLeftIndices.has(idx)) {
          const nullRight = createNullRow(rightDataPrefixed[0]);
          result.push({ ...leftRow, ...nullRight });
        }
      });

      // Add unmatched right rows
      rightDataPrefixed.forEach((rightRow, idx) => {
        if (!matchedRightIndices.has(idx)) {
          const nullLeft = createNullRow(leftData[0]);
          result.push({ ...nullLeft, ...rightRow });
        }
      });
      break;
  }

  return result;
}

/**
 * Check if two rows match the JOIN condition
 */
function matchesJoinCondition(
  leftRow: any,
  rightRow: any,
  leftColumn: string,
  rightColumn: string
): boolean {
  const leftValue = getColumnValue(leftRow, leftColumn);
  const rightValue = getColumnValue(rightRow, rightColumn);
  
  // Handle null/undefined
  if (leftValue == null || rightValue == null) {
    return false;
  }
  
  // Compare values (case-insensitive for strings)
  return String(leftValue).toLowerCase() === String(rightValue).toLowerCase();
}

/**
 * Create a row with all columns set to null
 */
function createNullRow(templateRow: any): any {
  if (!templateRow) return {};
  
  const nullRow: any = {};
  Object.keys(templateRow).forEach(key => {
    nullRow[key] = null;
  });
  return nullRow;
}

