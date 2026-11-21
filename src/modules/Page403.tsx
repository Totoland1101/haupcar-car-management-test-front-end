"use client";

import { useRouter } from "next/navigation";
import { Button, Result } from "antd";

export default function Page403() {
  const router = useRouter();

  return (
    <Result
      status="403"
      title="No access"
      subTitle="Your role doesn't allow this page. Ask an admin if you need it."
      extra={<Button onClick={() => router.back()}>Go back</Button>}
    />
  );
}
