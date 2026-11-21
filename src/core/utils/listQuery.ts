import type { CarStatus } from "../services/car";

export interface ListQuery {
  search: string;
  status?: CarStatus;
  brand?: string;
  sortBy: string;
  order: "asc" | "desc";
  page: number;
  pageSize: number;
}

export type QueryChanges = Partial<Record<keyof ListQuery, string | number | undefined>>;

export const DEFAULT_LIST_QUERY: ListQuery = {
  search: "",
  sortBy: "updatedAt",
  order: "desc",
  page: 1,
  pageSize: 10,
};

// Applies a change from the filters or the table. Undefined or blank puts a field back to its default.
export function applyQueryChanges(query: ListQuery, changes: QueryChanges): ListQuery {
  const next: Record<string, unknown> = { ...query };
  for (const [key, value] of Object.entries(changes) as [keyof ListQuery, string | number | undefined][]) {
    if (value === undefined || value === "") {
      next[key] = DEFAULT_LIST_QUERY[key];
    } else {
      next[key] = key === "page" || key === "pageSize" ? Number(value) : value;
    }
  }
  return next as unknown as ListQuery;
}
