import { useState } from "react";
import { Button, Form, Input, Select, Switch } from "antd";
import type { User, UserPayload } from "@/core/services/user";
import type { ResponseError } from "@/core/utils/http_response";

interface FormValues {
  username: string;
  name: string;
  password?: string;
  roleId?: number;
  isActive: boolean;
}

interface UserFormProps {
  /** null when adding a user */
  user: User | null;
  /** The logged-in user is editing their own account */
  isSelf: boolean;
  roleOptions: { value: number; label: string }[];
  /** Resolves to the API error when saving failed, or null when it worked. */
  onSubmit: (payload: UserPayload) => Promise<ResponseError | null>;
  onCancel: () => void;
}

export default function UserForm({ user, isSelf, roleOptions, onSubmit, onCancel }: UserFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const isNew = !user;

  async function handleFinish(values: FormValues) {
    setSubmitting(true);
    const error = await onSubmit({
      username: values.username,
      name: values.name,
      password: values.password || null,
      roleId: values.roleId!,
      isActive: values.isActive,
    });
    if (error) {
      // Field errors from the API, such as a username that is taken, go under their field.
      if (error.details.length) {
        form.setFields(
          error.details.map(({ field, message }) => ({ name: field as keyof FormValues, errors: [message] }))
        );
      }
      setSubmitting(false);
    }
  }

  return (
    <Form<FormValues>
      form={form}
      layout="vertical"
      requiredMark="optional"
      initialValues={
        user
          ? { username: user.username, name: user.name, roleId: user.role?.id, isActive: user.isActive }
          : { isActive: true }
      }
      onFinish={handleFinish}
    >
      <Form.Item
        label="Username"
        name="username"
        extra="Used to log in. Letters, numbers, dots, dashes and underscores."
        rules={[
          { required: true, whitespace: true, message: "Username is required" },
          { min: 3, max: 50 },
          { pattern: /^[A-Za-z0-9._-]+$/, message: "Use only letters, numbers, dots, dashes and underscores" },
        ]}
      >
        <Input autoComplete="off" maxLength={50} autoFocus={isNew} />
      </Form.Item>

      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, whitespace: true, message: "Name is required" }, { max: 100 }]}
      >
        <Input placeholder="e.g. Somchai Jaidee" maxLength={100} />
      </Form.Item>

      <Form.Item
        label="Role"
        name="roleId"
        rules={[{ required: true, message: "Role is required" }]}
        extra={isSelf ? "You can't change your own role." : undefined}
      >
        <Select options={roleOptions} placeholder="Select a role" disabled={isSelf} />
      </Form.Item>

      <Form.Item
        label={isNew ? "Password" : "New password"}
        name="password"
        extra={isNew ? "At least 8 characters." : "Leave blank to keep the current password."}
        rules={[{ required: isNew, message: "Password is required" }, { min: 8, max: 128 }]}
      >
        <Input.Password autoComplete="new-password" maxLength={128} />
      </Form.Item>

      <Form.Item
        label="Active"
        name="isActive"
        valuePropName="checked"
        extra={isSelf ? "You can't disable your own account." : "Disabled users can't log in."}
      >
        <Switch disabled={isSelf} />
      </Form.Item>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={submitting}>
          {isNew ? "Add user" : "Save changes"}
        </Button>
      </div>
    </Form>
  );
}
