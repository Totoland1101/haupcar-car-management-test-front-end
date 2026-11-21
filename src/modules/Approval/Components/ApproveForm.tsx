import { useState } from "react";
import { Button, Form, Select, Typography } from "antd";
import type { User } from "@/core/services/user";

interface ApproveFormProps {
  user: User;
  roleOptions: { value: number; label: string }[];
  /** Resolves to true when the approval went through */
  onSubmit: (roleId: number) => Promise<boolean>;
  onCancel: () => void;
}

export default function ApproveForm({ user, roleOptions, onSubmit, onCancel }: ApproveFormProps) {
  const [submitting, setSubmitting] = useState(false);
  // Start on the least powerful default role. The approver can pick another.
  const viewer = roleOptions.find((option) => option.label === "Viewer");

  async function handleFinish({ roleId }: { roleId: number }) {
    setSubmitting(true);
    if (!(await onSubmit(roleId))) setSubmitting(false);
  }

  return (
    <Form layout="vertical" initialValues={{ roleId: viewer?.value }} onFinish={handleFinish}>
      <Typography.Paragraph type="secondary">
        {user.name} ({user.username}) will be able to log in with the permissions of this role.
      </Typography.Paragraph>
      <Form.Item label="Role" name="roleId" rules={[{ required: true, message: "Pick a role" }]}>
        <Select options={roleOptions} placeholder="Select a role" />
      </Form.Item>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Approve
        </Button>
      </div>
    </Form>
  );
}
