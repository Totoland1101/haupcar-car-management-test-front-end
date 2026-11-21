import { useState } from "react";
import { Button, Col, Divider, Form, Input, Row, Select, Switch } from "antd";
import type { ProfilePayload, User, UserPayload } from "@/core/services/user";
import type { ResponseError } from "@/core/utils/http_response";
import ProfileFields from "./ProfileFields";

interface FormValues {
  username: string;
  password?: string;
  roleId?: number;
  isActive: boolean;
  profile: Partial<ProfilePayload>;
}

interface UserFormProps {
  /** null when adding a user */
  user: User | null;
  /** The logged-in user is editing their own account */
  isSelf: boolean;
  roleOptions: { value: number; label: string }[];
  departmentOptions: { value: number; label: string }[];
  /** Resolves to the API error when saving failed, or null when it worked. */
  onSubmit: (payload: UserPayload) => Promise<ResponseError | null>;
  onCancel: () => void;
}

// Blank optional fields go to the API as null.
export function toProfilePayload(values: Partial<ProfilePayload>): ProfilePayload {
  const blankToNull = (value?: string | null) => value?.trim() || null;
  return {
    firstName: values.firstName?.trim() ?? "",
    lastName: blankToNull(values.lastName),
    email: blankToNull(values.email),
    phone: blankToNull(values.phone),
    jobTitle: blankToNull(values.jobTitle),
    departmentId: values.departmentId ?? null,
  };
}

export default function UserForm({ user, isSelf, roleOptions, departmentOptions, onSubmit, onCancel }: UserFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const isNew = !user;

  async function handleFinish(values: FormValues) {
    setSubmitting(true);
    const error = await onSubmit({
      username: values.username,
      password: values.password || null,
      roleId: values.roleId!,
      isActive: values.isActive,
      profile: toProfilePayload(values.profile),
    });
    if (error) {
      // Field errors from the API, such as a username that is taken, go under their field.
      // Profile fields come back as "profile.firstName", which is their path in this form.
      if (error.details.length) {
        type FieldName = Parameters<typeof form.setFields>[0][number]["name"];
        form.setFields(
          error.details.map(({ field, message }) => ({ name: field.split(".") as FieldName, errors: [message] }))
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
          ? {
              username: user.username,
              roleId: user.role?.id,
              isActive: user.isActive,
              profile: {
                firstName: user.profile.firstName,
                lastName: user.profile.lastName,
                email: user.profile.email,
                phone: user.profile.phone,
                jobTitle: user.profile.jobTitle,
                departmentId: user.profile.department?.id ?? null,
              },
            }
          : { isActive: true, profile: {} }
      }
      onFinish={handleFinish}
    >
      <Divider titlePlacement="start" plain>
        Account
      </Divider>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Username"
            name="username"
            extra="Used to log in."
            rules={[
              { required: true, whitespace: true, message: "Username is required" },
              { min: 3, max: 50 },
              { pattern: /^[A-Za-z0-9._-]+$/, message: "Use only letters, numbers, dots, dashes and underscores" },
            ]}
          >
            <Input autoComplete="off" maxLength={50} autoFocus={isNew} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label={isNew ? "Password" : "New password"}
            name="password"
            extra={isNew ? "At least 8 characters." : "Leave blank to keep the current password."}
            rules={[{ required: isNew, message: "Password is required" }, { min: 8, max: 128 }]}
          >
            <Input.Password autoComplete="new-password" maxLength={128} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: "Role is required" }]}
            extra={isSelf ? "You can't change your own role." : undefined}
          >
            <Select options={roleOptions} placeholder="Select a role" disabled={isSelf} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Active"
            name="isActive"
            valuePropName="checked"
            extra={isSelf ? "You can't disable your own account." : "Disabled users can't log in."}
          >
            <Switch disabled={isSelf} />
          </Form.Item>
        </Col>
      </Row>

      <Divider titlePlacement="start" plain>
        Profile
      </Divider>
      <ProfileFields prefix={["profile"]} departmentOptions={departmentOptions} />

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
