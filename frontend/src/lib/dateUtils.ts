/**
 * Checks if a given date string or object represents "today" in the user's local time.
 */
export function isToday(dateInput: string | Date): boolean {
  if (!dateInput) return false;
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Checks if a date is within the last N days.
 */
export function isWithinDays(dateInput: string | Date, days: number): boolean {
  if (!dateInput) return false;
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const threshold = new Date();
  threshold.setDate(now.getDate() - days);
  
  return date >= threshold;
}
