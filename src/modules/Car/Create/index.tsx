"use client";

import { useRouter } from "next/navigation";
import { Card } from "antd";
import PageHeader from "@/components/PageHeader";
import useCar from "@/core/hooks/useCar";
import type { CarPayload } from "@/core/services/car";
import CarForm from "../Components/CarForm";

export default function CarCreate() {
  const router = useRouter();
  const { createCar } = useCar();

  async function handleSubmit(payload: CarPayload) {
    const { success, data, error } = await createCar(payload);
    if (!success) return error;
    router.replace(`/cars/${data.id}`);
    return null;
  }

  return (
    <>
      <PageHeader title="Add a car" breadcrumb={[{ title: "Cars", to: "/" }, { title: "Add car" }]} />
      <Card style={{ maxWidth: 820 }}>
        <CarForm submitLabel="Add car" onSubmit={handleSubmit} onCancel={() => router.back()} />
      </Card>
    </>
  );
}
