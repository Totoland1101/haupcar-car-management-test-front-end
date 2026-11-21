import { Tag } from "antd";
import { CAR_STATUS } from "@/core/constants/car";
import type { CarStatus } from "@/core/services/car";

export default function StatusTag({ status }: { status: CarStatus }) {
  const info = CAR_STATUS[status] ?? { label: status, color: "default" };
  return <Tag color={info.color}>{info.label}</Tag>;
}
