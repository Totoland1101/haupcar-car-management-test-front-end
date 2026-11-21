import { useEffect, useState } from "react";
import { Button, Input, Select } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { STATUS_OPTIONS } from "@/core/constants/car";
import type { ListQuery } from "@/core/utils/listQuery";
import type { QueryChanges } from ".";

interface FilterProps {
  query: ListQuery;
  brands: string[];
  hasFilters: boolean;
  onChange: (changes: QueryChanges) => void;
}

export default function Filter({ query, brands, hasFilters, onChange }: FilterProps) {
  const [searchText, setSearchText] = useState(query.search);

  // Keep the box in step with the URL, e.g. after the back button or "Clear filters".
  useEffect(() => {
    setSearchText(query.search);
  }, [query.search]);

  return (
    <div className="toolbar">
      <Input.Search
        className="search"
        placeholder="Search plate, brand, model, notes…"
        allowClear
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={(value) => onChange({ search: value.trim(), page: undefined })}
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
    </div>
  );
}
