"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import SideLayout from "@/components/Layouts/SideLayout";
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
    <SideLayout>
      <div className="login-title">Log in</div>

      {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />}

      <Form<LoginValues>
        name="login_form"
        labelCol={{ flex: "96px" }}
        labelAlign="left"
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Form.Item label="Username" name="username" rules={[{ required: true, message: "Username is required" }]}>
          <Input prefix={<UserOutlined />} autoComplete="username" autoFocus />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password is required" }]}>
          <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 4 }}>
          <Button type="primary" htmlType="submit" block loading={submitting} style={{ marginTop: 10 }}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </SideLayout>
  );
}
