import { useState } from "react";
import { AutoComplete, Button, Col, Form, Input, InputNumber, Radio, Row, Select } from "antd";
import { COMMON_BRANDS, PROVINCES, STATUS_OPTIONS } from "@/core/constants/car";
import type { Car, CarPayload, CarStatus } from "@/core/services/car";
import type { ResponseError } from "@/core/utils/http_response";

const maxYear = new Date().getFullYear() + 1;
const provinceOptions = PROVINCES.map((name) => ({ value: name, label: name }));

interface FormValues {
  registrationNumber: string;
  province?: string;
  brand: string;
  model: string;
  year: number | null;
  color: string | null;
  mileage: number | null;
  status: CarStatus;
  notes: string | null;
}

const EMPTY_CAR: FormValues = {
  registrationNumber: "",
  province: undefined,
  brand: "",
  model: "",
  year: null,
  color: "",
  mileage: null,
  status: "available",
  notes: "",
};

// The API expects null for blank optional fields, not empty strings or undefined.
function toPayload(values: FormValues): CarPayload {
  const blankToNull = <T,>(value: T | undefined | ""): T | null =>
    value === undefined || value === "" ? null : value;
  return {
    registrationNumber: values.registrationNumber,
    province: values.province ?? "",
    brand: values.brand,
    model: values.model,
    year: blankToNull(values.year),
    color: blankToNull(values.color?.trim()),
    mileage: blankToNull(values.mileage),
    status: values.status,
    notes: blankToNull(values.notes?.trim()),
  };
}

function required(label: string) {
  return { required: true, whitespace: true, message: `${label} is required` };
}

interface CarFormProps {
  initialValues?: Car;
  submitLabel: string;
  /** Resolves to the API error when saving failed, or null when it worked. */
  onSubmit: (payload: CarPayload) => Promise<ResponseError | null>;
  onCancel: () => void;
}

export default function CarForm({ initialValues, submitLabel, onSubmit, onCancel }: CarFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const brand = Form.useWatch("brand", form) ?? "";

  const brandOptions = COMMON_BRANDS.filter(
    (name) => name !== brand && name.toLowerCase().includes(brand.trim().toLowerCase())
  ).map((name) => ({ value: name }));

  async function handleFinish(values: FormValues) {
    setSubmitting(true);
    const error = await onSubmit(toPayload(values));
    if (error) {
      // Show server-side validation errors (including duplicate plates) next to the fields they belong to.
      if (error.details.length) {
        form.setFields(
          error.details.map(({ field, message }) => ({
            name: field as keyof FormValues,
            errors: [message],
          }))
        );
      }
      setSubmitting(false);
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{ ...EMPTY_CAR, ...initialValues }}
      onFinish={handleFinish}
      scrollToFirstError
      requiredMark="optional"
    >
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Registration number"
            name="registrationNumber"
            rules={[required("Registration number"), { max: 20 }]}
            extra="As shown on the plate, e.g. 1กข 1234"
          >
            <Input placeholder="1กข 1234" maxLength={20} autoFocus />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Province"
            name="province"
            rules={[{ required: true, message: "Province is required" }]}
          >
            <Select showSearch placeholder="Select the plate's province" options={provinceOptions} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Brand" name="brand" rules={[required("Brand"), { max: 50 }]}>
            <AutoComplete options={brandOptions} placeholder="e.g. Toyota" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Model" name="model" rules={[required("Model"), { max: 50 }]}>
            <Input placeholder="e.g. Yaris Ativ" maxLength={50} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8}>
          <Form.Item label="Year" name="year">
            <InputNumber
              placeholder={String(maxYear - 1)}
              min={1900}
              max={maxYear}
              precision={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item label="Color" name="color" rules={[{ max: 30 }]}>
            <Input placeholder="e.g. White" maxLength={30} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item label="Mileage" name="mileage">
            <InputNumber<number | string>
              placeholder="0"
              min={0}
              max={10_000_000}
              precision={0}
              suffix="km"
              formatter={(value) =>
                value === undefined || value === "" ? "" : Number(value).toLocaleString("en-US")
              }
              parser={(value) => value?.replace(/[^\d]/g, "") ?? ""}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Radio.Group options={STATUS_OPTIONS} optionType="button" buttonStyle="solid" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item label="Notes" name="notes">
            <Input.TextArea
              rows={4}
              maxLength={1000}
              showCount
              placeholder="Anything other staff should know about this car"
            />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="primary" htmlType="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </Form>
  );
}
