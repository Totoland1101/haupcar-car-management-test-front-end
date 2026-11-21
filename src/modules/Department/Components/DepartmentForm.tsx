import { useState } from "react";
import { Button, Form, Input } from "antd";
import type { DepartmentRow } from "@/core/services/department";
import type { ResponseError } from "@/core/utils/http_response";

interface DepartmentFormProps {
  /** null when adding a department */
  department: DepartmentRow | null;
  /** Resolves to the API error when saving failed, or null when it worked. */
  onSubmit: (name: string) => Promise<ResponseError | null>;
  onCancel: () => void;
}

export default function DepartmentForm({ department, onSubmit, onCancel }: DepartmentFormProps) {
  const [form] = Form.useForm<{ name: string }>();
  const [submitting, setSubmitting] = useState(false);

  async function handleFinish({ name }: { name: string }) {
    setSubmitting(true);
    const error = await onSubmit(name.trim());
    if (error) {
      if (error.details.length) {
        form.setFields(error.details.map(({ field, message }) => ({ name: field as "name", errors: [message] })));
      }
      setSubmitting(false);
    }
  }

  return (
    <Form form={form} layout="vertical" initialValues={{ name: department?.name }} onFinish={handleFinish}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, whitespace: true, message: "Name is required" }, { max: 100 }]}
      >
        <Input placeholder="e.g. Operations" maxLength={100} autoFocus />
      </Form.Item>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={submitting}>
          {department ? "Save changes" : "Add department"}
        </Button>
      </div>
    </Form>
  );
}
