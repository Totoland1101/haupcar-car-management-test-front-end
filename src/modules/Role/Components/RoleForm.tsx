import { useState } from "react";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import { PERMISSION_MODULE_LABEL, type PermissionCode } from "@/core/constants/permission";
import type { Permission, Role, RolePayload } from "@/core/services/role";
import type { ResponseError } from "@/core/utils/http_response";

interface FormValues {
  name: string;
  description?: string | null;
  permissions: PermissionCode[];
}

interface RoleFormProps {
  /** null when adding a role */
  role: Role | null;
  permissionList: Permission[];
  /** Resolves to the API error when saving failed, or null when it worked. */
  onSubmit: (payload: RolePayload) => Promise<ResponseError | null>;
  onCancel: () => void;
}

function groupByModule(permissions: Permission[]) {
  const groups = new Map<string, Permission[]>();
  for (const permission of permissions) {
    groups.set(permission.module, [...(groups.get(permission.module) ?? []), permission]);
  }
  return [...groups];
}

export default function RoleForm({ role, permissionList, onSubmit, onCancel }: RoleFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);

  async function handleFinish(values: FormValues) {
    setSubmitting(true);
    const error = await onSubmit({
      name: values.name,
      description: values.description?.trim() || null,
      permissions: values.permissions ?? [],
    });
    if (error) {
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
        role
          ? { name: role.name, description: role.description, permissions: role.permissions }
          : { permissions: [] }
      }
      onFinish={handleFinish}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, whitespace: true, message: "Name is required" }, { max: 50 }]}
      >
        <Input placeholder="e.g. Fleet manager" maxLength={50} autoFocus={!role} />
      </Form.Item>

      <Form.Item label="Description" name="description" rules={[{ max: 200 }]}>
        <Input placeholder="What people with this role do" maxLength={200} />
      </Form.Item>

      <Form.Item label="Permissions" name="permissions">
        <Checkbox.Group style={{ width: "100%" }}>
          <div className="permission-groups">
            {groupByModule(permissionList).map(([module, permissions]) => (
              <div key={module} className="permission-group">
                <Typography.Text strong>{PERMISSION_MODULE_LABEL[module] ?? module}</Typography.Text>
                {permissions.map((permission) => (
                  <Checkbox key={permission.code} value={permission.code}>
                    {permission.name}
                  </Checkbox>
                ))}
              </div>
            ))}
          </div>
        </Checkbox.Group>
      </Form.Item>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={submitting}>
          {role ? "Save changes" : "Add role"}
        </Button>
      </div>
    </Form>
  );
}
