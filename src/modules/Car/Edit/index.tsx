"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Skeleton } from "antd";
import PageHeader from "@/components/PageHeader";
import useCar from "@/core/hooks/useCar";
import type { CarPayload } from "@/core/services/car";
import CarForm from "../Components/CarForm";
import CarPhotos from "../Components/CarPhotos";
import LoadError from "../Components/LoadError";

export default function CarEdit({ id }: { id: string }) {
  const router = useRouter();
  const { carDetail: car, detailError, fetchCarDetail, updateCar } = useCar();
  // Wait for this page's own request. The form reads initialValues only once, so it must not
  // mount with a car left over from the previous page.
  const [loaded, setLoaded] = useState(false);

  async function load() {
    setLoaded(false);
    await fetchCarDetail(id);
    setLoaded(true);
  }

  useEffect(() => {
    load();
  }, [id]);

  if (loaded && detailError) return <LoadError error={detailError} onRetry={load} />;

  async function handleSubmit(payload: CarPayload) {
    if (!car) return null;
    const { success, error } = await updateCar(car.id, payload);
    if (!success) return error;
    router.replace(`/cars/${car.id}`);
    return null;
  }

  return (
    <>
      <PageHeader
        title="Edit car"
        breadcrumb={[
          { title: "Cars", to: "/" },
          { title: car?.registrationNumber ?? "…", to: `/cars/${id}` },
          { title: "Edit" },
        ]}
      />
      <Card style={{ maxWidth: 820 }}>
        {!loaded || !car ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <CarForm
            initialValues={car}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        )}
      </Card>
      {loaded && car && (
        <Card title="Photos" style={{ maxWidth: 820, marginTop: 16 }}>
          <CarPhotos carId={car.id} editable />
        </Card>
      )}
    </>
  );
}
