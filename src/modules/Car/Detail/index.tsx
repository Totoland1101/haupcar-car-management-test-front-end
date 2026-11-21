"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Descriptions, Popconfirm, Skeleton, Typography, type DescriptionsProps } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import useCar from "@/core/hooks/useCar";
import { formatDate, formatDateTime, formatMileage, orDash } from "@/core/utils/format";
import LicensePlate from "../Components/LicensePlate";
import LoadError from "../Components/LoadError";
import StatusTag from "../Components/StatusTag";

export default function CarDetail({ id }: { id: string }) {
  const router = useRouter();
  const { carDetail: car, detailError, fetchCarDetail, deleteCar } = useCar();
  // carDetail is shared state and may still hold the car from the previous page,
  // so show it only once this page's own request has finished.
  const [loaded, setLoaded] = useState(false);

  async function load() {
    setLoaded(false);
    await fetchCarDetail(id);
    setLoaded(true);
  }

  useEffect(() => {
    load();
  }, [id]);

  const breadcrumb = [{ title: "Cars", to: "/" }, { title: car?.registrationNumber ?? "…" }];

  if (loaded && detailError) return <LoadError error={detailError} onRetry={load} />;

  if (!loaded || !car) {
    return (
      <>
        <PageHeader title="Car details" breadcrumb={breadcrumb} />
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </>
    );
  }

  async function handleDelete() {
    if (car && (await deleteCar(car))) router.replace("/");
  }

  const items: DescriptionsProps["items"] = [
    { key: "plate", label: "Registration number", children: car.registrationNumber },
    { key: "province", label: "Province", children: car.province },
    { key: "brand", label: "Brand", children: car.brand },
    { key: "model", label: "Model", children: car.model },
    { key: "year", label: "Year", children: orDash(car.year) },
    { key: "color", label: "Color", children: orDash(car.color) },
    { key: "mileage", label: "Current mileage", children: formatMileage(car.mileage) },
    { key: "registeredOn", label: "Registered on", children: formatDate(car.registeredOn) },
    { key: "registeredMileage", label: "Mileage at registration", children: formatMileage(car.registeredMileage) },
    { key: "status", label: "Status", children: <StatusTag status={car.status} /> },
    {
      key: "notes",
      label: "Notes",
      span: "filled",
      children: car.notes ? (
        <Typography.Paragraph style={{ whiteSpace: "pre-wrap", margin: 0 }}>{car.notes}</Typography.Paragraph>
      ) : (
        <Typography.Text type="secondary">No notes</Typography.Text>
      ),
    },
    { key: "created", label: "Added", children: formatDateTime(car.createdAt) },
    { key: "updated", label: "Last updated", children: formatDateTime(car.updatedAt) },
  ];

  return (
    <>
      <PageHeader
        title="Car details"
        breadcrumb={breadcrumb}
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            <PermissionWrapper permission={PERMISSIONS.CAR_UPDATE}>
              <Button icon={<EditOutlined />} onClick={() => router.push(`/cars/${car.id}/edit`)}>
                Edit
              </Button>
            </PermissionWrapper>
            <PermissionWrapper permission={PERMISSIONS.CAR_DELETE}>
              <Popconfirm
                title="Delete this car?"
                description="This cannot be undone."
                okText="Delete"
                okButtonProps={{ danger: true }}
                onConfirm={handleDelete}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </PermissionWrapper>
          </div>
        }
      />

      <Card style={{ marginBottom: 16 }}>
        <div className="car-hero">
          <LicensePlate number={car.registrationNumber} province={car.province} size="large" />
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {car.brand} {car.model}
            </Typography.Title>
            <Typography.Text type="secondary">
              {[car.year, car.color].filter(Boolean).join(" · ") || "No year or color recorded"}
            </Typography.Text>
            <div style={{ marginTop: 8 }}>
              <StatusTag status={car.status} />
            </div>
          </div>
        </div>
      </Card>

      <Card title="Details">
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} items={items} />
      </Card>
    </>
  );
}
