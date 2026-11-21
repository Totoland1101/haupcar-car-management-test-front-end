const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(iso: string | null | undefined): string {
  return iso ? dateTimeFormat.format(new Date(iso)) : "-";
}

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

// For YYYY-MM-DD values. Parsed as a local date so the day doesn't shift with the time zone.
export function formatDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "-";
  const [year, month, day] = isoDate.split("-").map(Number);
  return dateFormat.format(new Date(year, month - 1, day));
}

export function formatMileage(km: number | null | undefined): string {
  return km == null ? "-" : `${km.toLocaleString("en-US")} km`;
}

export function orDash<T>(value: T | null | undefined): T | "-" {
  return value === null || value === undefined || value === "" ? "-" : value;
}
