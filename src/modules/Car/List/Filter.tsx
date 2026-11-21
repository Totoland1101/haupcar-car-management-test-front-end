import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button, Input, Select } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { STATUS_OPTIONS } from "@/core/constants/car";
import type { ListQuery } from "@/core/utils/listQuery";
import type { QueryChanges } from ".";

interface FilterProps {
  query: ListQuery;
  brands: string[];
  hasFilters: boolean;
  onChange: (changes: QueryChanges) => void;
  /** Shown at the right end, e.g. the Add car button */
  extra?: ReactNode;
}

export default function Filter({ query, brands, hasFilters, onChange, extra }: FilterProps) {
  const [searchText, setSearchText] = useState(query.search);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep the box in step with the URL, e.g. after the back button or "Clear filters".
  useEffect(() => {
    setSearchText(query.search);
  }, [query.search]);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  // Searches a moment after typing stops. Enter searches straight away.
  function search(value: string, delay: number) {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      if (value.trim() !== query.search) onChange({ search: value.trim(), page: undefined });
    }, delay);
  }

  return (
    <div className="toolbar">
      <Input
        className="search"
        prefix={<SearchOutlined />}
        placeholder="Search plate, brand, model, notes…"
        allowClear
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          search(e.target.value, 400);
        }}
        onPressEnter={() => search(searchText, 0)}
      />
      <Select
        className="filter"
        placeholder="All brands"
        allowClear
        value={query.brand}
        options={brands.map((brand) => ({ value: brand, label: brand }))}
        onChange={(brand) => onChange({ brand, page: undefined })}
      />
      <Select
        className="filter"
        placeholder="All statuses"
        allowClear
        value={query.status}
        options={STATUS_OPTIONS}
        onChange={(status) => onChange({ status, page: undefined })}
      />
      {hasFilters && (
        <Button
          icon={<ReloadOutlined />}
          onClick={() =>
            onChange({ search: undefined, status: undefined, brand: undefined, page: undefined })
          }
        >
          Clear filters
        </Button>
      )}
      {extra && <div className="toolbar-extra">{extra}</div>}
    </div>
  );
}
