"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button, Result, Spin } from "antd";
import { useAuth } from "./AuthContext";

// Wraps every page that needs a logged-in user. Anyone else is sent to /login, and comes
// back to the same page after logging in.
export function PrivateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, errorMessage } = useAuth();

  useEffect(() => {
    if (status !== "anonymous") return;
    const next = window.location.pathname + window.location.search;
    router.replace(next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`);
  }, [status, router]);

  if (status === "authenticated") return <>{children}</>;

  if (status === "error") {
    return (
      <Result
        status="error"
        title="Could not check your login"
        subTitle={errorMessage}
        extra={<Button onClick={() => window.location.reload()}>Try again</Button>}
      />
    );
  }

  return (
    <div className="full-page-center">
      <Spin size="large" />
    </div>
  );
}
