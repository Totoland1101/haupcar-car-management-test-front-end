"use client";

import { useRouter } from "next/navigation";
import { Button, Result } from "antd";

export default function Page404() {
  const router = useRouter();

  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The page you are looking for does not exist."
      extra={
        <Button type="primary" onClick={() => router.push("/")}>
          Back to all cars
        </Button>
      }
    />
  );
}
