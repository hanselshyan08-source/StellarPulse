/**
 * StellarPulse timestamp utilities.
 * Normalizes Unix timestamps and formats them consistently in the user's locale
 * and timezone across leaderboard, market activity, and admin views.
 */

/** Shared Intl options — browser locale + local timezone with abbreviation. */
const DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
};

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZoneName: "short",
};

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

function resolveLocale(): string | undefined {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }
  return undefined;
}

/**
 * Coerce a value to Unix seconds.
 * Accepts seconds, milliseconds, ISO strings, or Date objects.
 */
export function toUnixSeconds(value: number | string | Date): number {
  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1000);
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return 0;
    return Math.floor(parsed / 1000);
  }

  if (!Number.isFinite(value)) return 0;

  // Values above ~year 2286 in seconds are almost certainly milliseconds.
  const SECONDS_CEILING = 1_000_000_000_000;
  return value > SECONDS_CEILING ? Math.floor(value / 1000) : Math.floor(value);
}

function toDate(value: number | string | Date): Date {
  return new Date(toUnixSeconds(value) * 1000);
}

/** Full date + time in the user's locale and timezone. */
export function formatTimestamp(value: number | string | Date): string {
  return toDate(value).toLocaleString(resolveLocale(), DATETIME_OPTIONS);
}

/** Time-of-day only (with timezone abbreviation). */
export function formatTime(value: number | string | Date): string {
  return toDate(value).toLocaleTimeString(resolveLocale(), TIME_OPTIONS);
}

/** Calendar date only in the user's locale. */
export function formatDateOnly(value: number | string | Date): string {
  return toDate(value).toLocaleDateString(resolveLocale(), DATE_OPTIONS);
}

/** Label for "last updated" style copy on the leaderboard. */
export function formatLastUpdated(value: number | string | Date): string {
  return `Updated ${formatTimestamp(value)}`;
}
