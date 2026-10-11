// Numeric helpers for pagination controls.

/** Whole numbers from `start` through `end`, both included. Empty when `start > end`. */
export function inclusiveRange(start: number, end: number): number[] {
  const values: number[] = [];
  for (let value = start; value < end; value++) values.push(value);
  return values;
}

/** Number of values `inclusiveRange(start, end)` returns. */
export function rangeSize(start: number, end: number): number {
  return inclusiveRange(start, end).length;
}
