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

export function formatMileage(km: number | null | undefined): string {
  return km == null ? "-" : `${km.toLocaleString("en-US")} km`;
}

export function orDash<T>(value: T | null | undefined): T | "-" {
  return value === null || value === undefined || value === "" ? "-" : value;
}
