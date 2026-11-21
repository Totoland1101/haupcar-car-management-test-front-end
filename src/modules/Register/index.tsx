"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Form, Input, Result } from "antd";
import { IdcardOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import SideLayout from "@/components/Layouts/SideLayout";
import { useAuth } from "@/core/context/AuthContext";

interface RegisterValues {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const router = useRouter();
  const { status, register } = useAuth();
  const [form] = Form.useForm<RegisterValues>();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [doneMessage, setDoneMessage] = useState<string | null>(null);

  // Someone who is already logged in has no reason to be here.
  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  async function handleFinish({ name, username, password }: RegisterValues) {
    setSubmitting(true);
    setError(null);
    const response = await register({ name, username, password });
    if (response.success) {
      setDoneMessage(response.data.message);
      return;
    }
    if (response.error.details.length) {
      form.setFields(
        response.error.details.map(({ field, message }) => ({ name: field as keyof RegisterValues, errors: [message] }))
      );
    } else {
      setError(response.error.message);
    }
    setSubmitting(false);
  }

  if (doneMessage) {
    return (
      <SideLayout>
        <Result
          status="success"
          title="Registration sent"
          subTitle={doneMessage}
          extra={
            <Link href="/login">
              <Button type="primary">Back to log in</Button>
            </Link>
          }
        />
      </SideLayout>
    );
  }

  return (
    <SideLayout>
      <div className="login-title">Register</div>
      <p className="login-subtitle">An admin checks every new account before it can log in.</p>

      {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />}

      <Form<RegisterValues>
        form={form}
        name="register_form"
        labelCol={{ flex: "136px" }}
        labelAlign="start"
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, whitespace: true, message: "Name is required" }, { max: 100 }]}
        >
          <Input prefix={<IdcardOutlined />} placeholder="e.g. Somchai Jaidee" autoComplete="name" autoFocus />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, whitespace: true, message: "Username is required" },
            { min: 3, max: 50 },
            { pattern: /^[A-Za-z0-9._-]+$/, message: "Use only letters, numbers, dots, dashes and underscores" },
          ]}
        >
          <Input prefix={<UserOutlined />} autoComplete="username" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Password is required" }, { min: 8, max: 128 }]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Type the password again" },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || value === getFieldValue("password")
                  ? Promise.resolve()
                  : Promise.reject(new Error("The passwords don't match")),
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 4 }}>
          <Button type="primary" htmlType="submit" block loading={submitting} style={{ marginTop: 10 }}>
            Register
          </Button>
        </Form.Item>
      </Form>

      <div className="login-switch">
        Already have an account? <Link href="/login">Log in</Link>
      </div>
    </SideLayout>
  );
}
