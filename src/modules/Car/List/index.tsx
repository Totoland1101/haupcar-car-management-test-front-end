"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import useCar from "@/core/hooks/useCar";
import type { Car } from "@/core/services/car";
import { applyQueryChanges, type QueryChanges } from "@/core/utils/listQuery";
import DataTable from "./DataTable";
import Filter from "./Filter";
import SummaryCards from "./SummaryCards";

export default function CarList() {
  const router = useRouter();
  const { carList, total, summary, loadingList, listQuery: query, setListQuery, fetchCarList, fetchSummary, deleteCar } =
    useCar();
  const queryKey = JSON.stringify(query);

  // The filters live in shared state, so they are still there after opening a car and coming back.
  useEffect(() => {
    fetchCarList(query);
  }, [queryKey]);

  useEffect(() => {
    fetchSummary();
  }, []);

  function updateQuery(changes: QueryChanges) {
    setListQuery(applyQueryChanges(query, changes));
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
      <PageHeader title="Cars" subtitle="Every company car recorded in the system" />

      <SummaryCards
        summary={summary}
        activeStatus={query.status}
        onSelect={(status) => updateQuery({ status, page: undefined })}
      />

      {isEmptyRegistry && !hasFilters ? (
        <Card>
          <Empty description="No cars recorded yet" style={{ padding: "32px 0" }}>
            <PermissionWrapper permission={PERMISSIONS.CAR_CREATE}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/cars/new")}>
                Add the first car
              </Button>
            </PermissionWrapper>
          </Empty>
        </Card>
      ) : (
        <div className="page-stack">
          <Card size="small" className="toolbar-card">
            <Filter
              query={query}
              brands={summary?.brands ?? []}
              hasFilters={hasFilters}
              onChange={updateQuery}
              extra={
                <PermissionWrapper permission={PERMISSIONS.CAR_CREATE}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={() => router.push("/cars/new")}>
                    Add car
                  </Button>
                </PermissionWrapper>
              }
            />
          </Card>
          <Card>
            <DataTable
              query={query}
              cars={carList}
              total={total}
              loading={loadingList}
              onChange={updateQuery}
              onDelete={handleDelete}
            />
          </Card>
        </div>
      )}
    </>
  );
}
