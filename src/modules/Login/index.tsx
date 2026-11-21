"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "@/core/context/AuthContext";

interface LoginValues {
  username: string;
  password: string;
}

// Only follow ?next= to a page on this site, never to another domain.
function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/login")) return "/";
  return next;
}

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const next = safeNext(searchParams.get("next"));

  // Covers both a fresh login and opening /login while already logged in.
  useEffect(() => {
    if (status === "authenticated") router.replace(next);
  }, [status, next, router]);

  async function handleFinish({ username, password }: LoginValues) {
    setSubmitting(true);
    setError(null);
    const { success, error: loginError } = await login(username, password);
    if (!success) {
      setError(loginError.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="login-brand">
          <img src="/car.svg" alt="" width={44} height={44} />
          <Typography.Title level={3}>haupcar-management</Typography.Title>
          <Typography.Text type="secondary">Log in to manage the company&apos;s cars</Typography.Text>
        </div>

        {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />}

        <Form<LoginValues> layout="vertical" requiredMark={false} onFinish={handleFinish}>
          <Form.Item label="Username" name="username" rules={[{ required: true, message: "Enter your username" }]}>
            <Input prefix={<UserOutlined />} autoComplete="username" autoFocus size="large" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Enter your password" }]}>
            <Input.Password prefix={<LockOutlined />} autoComplete="current-password" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
            Log in
          </Button>
        </Form>
      </Card>
    </div>
  );
}
