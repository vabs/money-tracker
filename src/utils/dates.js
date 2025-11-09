const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export function parseLocalDate(value) {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return normalizeDate(value);
  }

  if (typeof value === 'string') {
    const match = ISO_DATE_REGEX.exec(value.trim());
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const parsed = new Date(year, month, day);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed;
  }

  return null;
}

export function formatLocalDate(value) {
  const date = value instanceof Date ? value : parseLocalDate(value);
  if (!date) return '';

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function differenceInDays(start, end) {
  const startDate = parseLocalDate(start);
  const endDate = parseLocalDate(end);
  if (!startDate || !endDate) {
    return NaN;
  }

  const utcStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const utcEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  return Math.floor((utcEnd - utcStart) / MS_PER_DAY);
}

export function addDays(dateInput, days = 0) {
  const baseDate = parseLocalDate(dateInput);
  if (!baseDate || Number.isNaN(days)) return '';
  const result = new Date(baseDate);
  result.setDate(baseDate.getDate() + Number(days));
  return formatLocalDate(result);
}

export function isBefore(a, b) {
  const diff = differenceInDays(a, b);
  if (Number.isNaN(diff)) return false;
  return diff > 0;
}

export function getTodayISO() {
  return formatLocalDate(new Date());
}
