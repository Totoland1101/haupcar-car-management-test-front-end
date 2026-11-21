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

export const DEFAULT_SORT = { sortBy: "updatedAt", order: "desc" } as const;

// Filters, sorting and paging live in the URL, so a refresh or the back button keeps them.
export function readListQuery(searchParams: Pick<URLSearchParams, "get">): ListQuery {
  const get = (key: string) => searchParams.get(key) || undefined;
  return {
    search: get("search") ?? "",
    status: get("status") as CarStatus | undefined,
    brand: get("brand"),
    sortBy: get("sortBy") ?? DEFAULT_SORT.sortBy,
    order: (get("order") as ListQuery["order"] | undefined) ?? DEFAULT_SORT.order,
    page: Number(get("page")) || 1,
    pageSize: Number(get("pageSize")) || 10,
  };
}
