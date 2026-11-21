"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Card } from "antd";
import PageHeader from "@/components/PageHeader";
import { PERMISSIONS } from "@/core/constants/permission";
import { useAuth } from "@/core/context/AuthContext";
import useCar from "@/core/hooks/useCar";
import type { CarPayload } from "@/core/services/car";
import CarPhotoService, { type CarSide } from "@/core/services/carPhoto";
import CarForm from "../Components/CarForm";
import CarPhotos, { type PendingPhotos } from "../Components/CarPhotos";

export default function CarCreate() {
  const router = useRouter();
  const { message } = App.useApp();
  const { hasPermission } = useAuth();
  const { createCar } = useCar();
  // Photos need a saved car, so they are uploaded right after it is created.
  const [photos, setPhotos] = useState<PendingPhotos>({});
  const canAddPhotos = hasPermission(PERMISSIONS.CAR_UPDATE);

  async function handleSubmit(payload: CarPayload) {
    const { success, data, error } = await createCar(payload);
    if (!success) return error;

    const failed: CarSide[] = [];
    for (const [side, file] of Object.entries(photos) as [CarSide, File][]) {
      const upload = await CarPhotoService.upload(data.id, side, file);
      if (!upload.success) failed.push(side);
    }
    if (failed.length) message.warning(`The car was saved, but these photos weren't: ${failed.join(", ")}`);

    router.replace(`/cars/${data.id}`);
    return null;
  }

  return (
    <>
      <PageHeader title="Add a car" breadcrumb={[{ title: "Cars", to: "/" }, { title: "Add car" }]} />
      {canAddPhotos && (
        <Card title="Photos" style={{ maxWidth: 820, marginBottom: 16 }}>
          <CarPhotos editable pending={photos} onPendingChange={setPhotos} />
        </Card>
      )}
      <Card style={{ maxWidth: 820 }}>
        <CarForm submitLabel="Add car" onSubmit={handleSubmit} onCancel={() => router.back()} />
      </Card>
    </>
  );
}
