"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Form, Input, Result } from "antd";
import { IdcardOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import SideLayout from "@/components/Layouts/SideLayout";
import { useAuth } from "@/core/context/AuthContext";

interface RegisterValues {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
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

  // Send anyone who is already logged in to the home page.
  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  async function handleFinish({ firstName, lastName, email, phone, username, password }: RegisterValues) {
    setSubmitting(true);
    setError(null);
    const blankToNull = (value?: string) => value?.trim() || null;
    const response = await register({
      username,
      password,
      profile: { firstName: firstName.trim(), lastName: blankToNull(lastName), email: blankToNull(email), phone: blankToNull(phone) },
    });
    if (response.success) {
      setDoneMessage(response.data.message);
      return;
    }
    if (response.error.details.length) {
      form.setFields(
        // "profile.firstName" from the API is "firstName" in this form.
        response.error.details.map(({ field, message }) => ({
          name: field.replace(/^profile\./, "") as keyof RegisterValues,
          errors: [message],
        }))
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
          label="First name"
          name="firstName"
          rules={[{ required: true, whitespace: true, message: "First name is required" }, { max: 100 }]}
        >
          <Input prefix={<IdcardOutlined />} autoComplete="given-name" autoFocus />
        </Form.Item>
        <Form.Item label="Last name" name="lastName" rules={[{ max: 100 }]}>
          <Input prefix={<IdcardOutlined />} autoComplete="family-name" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Email is not valid" }, { max: 255 }]}>
          <Input prefix={<MailOutlined />} autoComplete="email" />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ pattern: /^[0-9+\-() ]+$/, message: "Use digits, spaces and + - ( )" }, { max: 30 }]}
        >
          <Input prefix={<PhoneOutlined />} autoComplete="tel" />
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
