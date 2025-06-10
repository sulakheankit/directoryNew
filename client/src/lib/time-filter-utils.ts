import { TimeFilterValue } from "@/components/time-filter";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subDays, subWeeks, subMonths, subQuarters, subYears, isWithinInterval } from "date-fns";

export function getDateRangeFromFilter(filter: TimeFilterValue): { start: Date | null; end: Date | null } {
  const now = new Date();
  
  switch (filter.type) {
    case 'custom':
      return {
        start: filter.startDate || null,
        end: filter.endDate || null,
      };
      
    case 'fixed':
      switch (filter.range) {
        case 'all':
          return { start: null, end: null };
        
        case 'today':
          return {
            start: startOfDay(now),
            end: endOfDay(now),
          };
          
        case 'yesterday':
          const yesterday = subDays(now, 1);
          return {
            start: startOfDay(yesterday),
            end: endOfDay(yesterday),
          };
          
        case 'this_week':
          return {
            start: startOfWeek(now),
            end: endOfWeek(now),
          };
          
        case 'last_week':
          const lastWeekStart = startOfWeek(subWeeks(now, 1));
          return {
            start: lastWeekStart,
            end: endOfWeek(lastWeekStart),
          };
          
        case 'this_month':
          return {
            start: startOfMonth(now),
            end: endOfMonth(now),
          };
          
        case 'last_month':
          const lastMonthStart = startOfMonth(subMonths(now, 1));
          return {
            start: lastMonthStart,
            end: endOfMonth(lastMonthStart),
          };
          
        case 'this_quarter':
          return {
            start: startOfQuarter(now),
            end: endOfQuarter(now),
          };
          
        case 'last_quarter':
          const lastQuarterStart = startOfQuarter(subQuarters(now, 1));
          return {
            start: lastQuarterStart,
            end: endOfQuarter(lastQuarterStart),
          };
          
        case 'this_year':
          return {
            start: startOfYear(now),
            end: endOfYear(now),
          };
          
        case 'last_year':
          const lastYearStart = startOfYear(subYears(now, 1));
          return {
            start: lastYearStart,
            end: endOfYear(lastYearStart),
          };
          
        default:
          return { start: null, end: null };
      }
      
    case 'rolling':
      switch (filter.range) {
        case 'last_7_days':
          return {
            start: subDays(now, 7),
            end: now,
          };
          
        case 'last_14_days':
          return {
            start: subDays(now, 14),
            end: now,
          };
          
        case 'last_30_days':
          return {
            start: subDays(now, 30),
            end: now,
          };
          
        case 'last_60_days':
          return {
            start: subDays(now, 60),
            end: now,
          };
          
        case 'last_90_days':
          return {
            start: subDays(now, 90),
            end: now,
          };
          
        case 'last_180_days':
          return {
            start: subDays(now, 180),
            end: now,
          };
          
        case 'last_365_days':
          return {
            start: subDays(now, 365),
            end: now,
          };
          
        default:
          return { start: null, end: null };
      }
      
    default:
      return { start: null, end: null };
  }
}

export function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start && !end) return true;
  if (!start) return date <= end!;
  if (!end) return date >= start;
  return isWithinInterval(date, { start, end });
}

export function filterByDateRange<T extends { createdAt?: Date; date?: Date; participatedDate?: Date; sentAt?: Date }>(
  items: T[],
  filter: TimeFilterValue
): T[] {
  const { start, end } = getDateRangeFromFilter(filter);
  
  if (!start && !end) return items;
  
  return items.filter(item => {
    // Try different date fields that might exist on the item
    const itemDate = item.createdAt || item.date || item.participatedDate || item.sentAt;
    if (!itemDate) return true; // Include items without dates
    
    return isDateInRange(itemDate, start, end);
  });
}