import { useRouter } from "next/navigation";
import { Button, Result } from "antd";
import type { ResponseError } from "@/core/utils/http_response";

// Shown by the detail and edit pages when the car can't be loaded.
export default function LoadError({ error, onRetry }: { error: ResponseError; onRetry: () => void }) {
  const router = useRouter();

  // 400 means the id in the URL isn't a number, so treat it like a missing car.
  if (error.status === 404 || error.status === 400) {
    return (
      <Result
        status="404"
        title="Car not found"
        subTitle="It may have been deleted, or the link is wrong."
        extra={
          <Button type="primary" onClick={() => router.push("/")}>
            Back to all cars
          </Button>
        }
      />
    );
  }

  return (
    <Result
      status="error"
      title="Could not load the car"
      subTitle={error.message}
      extra={<Button onClick={onRetry}>Try again</Button>}
    />
  );
}
