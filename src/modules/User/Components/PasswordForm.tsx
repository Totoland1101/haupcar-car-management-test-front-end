import { useState } from "react";
import { Button, Form, Input } from "antd";
import type { ResponseError } from "@/core/utils/http_response";

export interface PasswordValues {
  currentPassword?: string;
  newPassword: string;
}

interface PasswordFormProps {
  /** Ask for the current password. True when people change their own. */
  askCurrent: boolean;
  /** Resolves to the API error when saving failed, or null when it worked. */
  onSubmit: (values: PasswordValues) => Promise<ResponseError | null>;
  onCancel: () => void;
}

export default function PasswordForm({ askCurrent, onSubmit, onCancel }: PasswordFormProps) {
  const [form] = Form.useForm<PasswordValues & { confirmPassword: string }>();
  const [submitting, setSubmitting] = useState(false);

  async function handleFinish({ currentPassword, newPassword }: PasswordValues) {
    setSubmitting(true);
    const error = await onSubmit({ currentPassword, newPassword });
    if (error) {
      // The admin endpoint calls the field "password". In this form it is "newPassword".
      if (error.details.length) {
        form.setFields(
          error.details.map(({ field, message }) => ({
            name: (field === "password" ? "newPassword" : field) as keyof PasswordValues,
            errors: [message],
          }))
        );
      }
      setSubmitting(false);
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      {askCurrent && (
        <Form.Item
          label="Current password"
          name="currentPassword"
          rules={[{ required: true, message: "Enter your current password" }]}
        >
          <Input.Password autoComplete="current-password" autoFocus />
        </Form.Item>
      )}
      <Form.Item
        label="New password"
        name="newPassword"
        extra="At least 8 characters."
        rules={[{ required: true, message: "Enter a new password" }, { min: 8, max: 128 }]}
      >
        <Input.Password autoComplete="new-password" autoFocus={!askCurrent} />
      </Form.Item>
      <Form.Item
        label="Confirm new password"
        name="confirmPassword"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "Type the new password again" },
          ({ getFieldValue }) => ({
            validator: (_, value) =>
              !value || value === getFieldValue("newPassword")
                ? Promise.resolve()
                : Promise.reject(new Error("The passwords don't match")),
          }),
        ]}
      >
        <Input.Password autoComplete="new-password" />
      </Form.Item>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Save password
        </Button>
      </div>
    </Form>
  );
}
