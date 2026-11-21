"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";
import useCar from "@/core/hooks/useCar";
import type { Car } from "@/core/services/car";
import { readListQuery, type ListQuery } from "@/core/utils/listQuery";
import DataTable from "./DataTable";
import Filter from "./Filter";
import SummaryCards from "./SummaryCards";

export type QueryChanges = Partial<Record<keyof ListQuery, string | number | undefined>>;

export default function CarList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = readListQuery(searchParams);
  const queryKey = searchParams.toString();
  const { carList, total, summary, loadingList, fetchCarList, fetchSummary, deleteCar } = useCar();

  useEffect(() => {
    fetchCarList(readListQuery(new URLSearchParams(queryKey)));
  }, [queryKey]);

  useEffect(() => {
    fetchSummary();
  }, []);

  function updateQuery(changes: QueryChanges) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined || value === "") next.delete(key);
      else next.set(key, String(value));
    }
    const queryString = next.toString();
    router.push(queryString ? `/?${queryString}` : "/", { scroll: false });
  }

  async function handleDelete(car: Car) {
    if (!(await deleteCar(car))) return;
    // Deleting the last row on a page would leave an empty page, so step back one.
    if (carList.length === 1 && query.page > 1) {
      updateQuery({ page: query.page - 1 });
    } else {
      fetchCarList(query);
    }
    fetchSummary();
  }

  const hasFilters = Boolean(query.search || query.status || query.brand);
  const isEmptyRegistry = summary?.total === 0;

  return (
    <>
      <PageHeader
        title="Cars"
        subtitle="Every company car recorded in the system"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/cars/new")}>
            Add car
          </Button>
        }
      />

      <SummaryCards
        summary={summary}
        activeStatus={query.status}
        onSelect={(status) => updateQuery({ status, page: undefined })}
      />

      <Card>
        {isEmptyRegistry && !hasFilters ? (
          <Empty description="No cars recorded yet" style={{ padding: "32px 0" }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/cars/new")}>
              Add the first car
            </Button>
          </Empty>
        ) : (
          <>
            <Filter
              query={query}
              brands={summary?.brands ?? []}
              hasFilters={hasFilters}
              onChange={updateQuery}
            />
            <DataTable
              query={query}
              cars={carList}
              total={total}
              loading={loadingList}
              onChange={updateQuery}
              onDelete={handleDelete}
            />
          </>
        )}
      </Card>
    </>
  );
}
