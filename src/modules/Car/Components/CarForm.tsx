import { useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { AutoComplete, Button, Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select } from "antd";
import { COMMON_BRANDS, PROVINCES, STATUS_OPTIONS, modelsForBrand } from "@/core/constants/car";
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
  registeredOn: Dayjs | null;
  registeredMileage: number | null;
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
  registeredOn: null,
  registeredMileage: null,
  status: "available",
  notes: "",
};

// The API wants null for blank optional fields, so empty strings and undefined become null.
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
    registeredOn: values.registeredOn ? values.registeredOn.format("YYYY-MM-DD") : null,
    registeredMileage: blankToNull(values.registeredMileage),
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
  const model = Form.useWatch("model", form) ?? "";

  const brandOptions = COMMON_BRANDS.filter(
    (name) => name !== brand && name.toLowerCase().includes(brand.trim().toLowerCase())
  ).map((name) => ({ value: name }));

  const brandModels = modelsForBrand(brand);
  const modelOptions = brandModels
    .filter((name) => name !== model && name.toLowerCase().includes(model.trim().toLowerCase()))
    .map((name) => ({ value: name }));

  // A model from another brand no longer fits. A model typed for a brand that isn't in
  // the list is left alone.
  function handleValuesChange(changed: Partial<FormValues>) {
    if (!("brand" in changed)) return;
    const models = modelsForBrand(changed.brand);
    const current = form.getFieldValue("model");
    if (models.length && current && !models.includes(current)) form.setFieldValue("model", "");
  }

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
      initialValues={{
        ...EMPTY_CAR,
        ...initialValues,
        // A new car is registered today unless the user picks another day.
        registeredOn: initialValues ? dayjs(initialValues.registeredOn) : dayjs(),
      }}
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
      scrollToFirstError
      requiredMark="optional"
    >
      <Row gutter={16}>
        <Col xs={24} md={12} xl={6}>
          <Form.Item
            label="Registration number"
            name="registrationNumber"
            rules={[required("Registration number"), { max: 20 }]}
            extra="As shown on the plate, e.g. 1กข 1234"
          >
            <Input placeholder="1กข 1234" maxLength={20} autoFocus />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Form.Item
            label="Province"
            name="province"
            rules={[{ required: true, message: "Province is required" }]}
          >
            <Select showSearch placeholder="Select the plate's province" options={provinceOptions} />
          </Form.Item>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <Form.Item label="Brand" name="brand" rules={[required("Brand"), { max: 50 }]}>
            <AutoComplete options={brandOptions} placeholder="e.g. Toyota" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Form.Item
            label="Model"
            name="model"
            rules={[required("Model"), { max: 50 }]}
            extra={brand.trim() ? undefined : "Pick a brand first"}
          >
            <AutoComplete
              options={modelOptions}
              disabled={!brand.trim()}
              placeholder={brandModels.length ? `e.g. ${brandModels[0]}` : "e.g. Yaris Ativ"}
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={8} xl={4}>
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
        <Col xs={24} sm={8} xl={4}>
          <Form.Item label="Color" name="color" rules={[{ max: 30 }]}>
            <Input placeholder="e.g. White" maxLength={30} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} xl={4}>
          <Form.Item label="Current mileage" name="mileage">
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

        <Col xs={24} sm={12} xl={6}>
          <Form.Item
            label="Registered on"
            name="registeredOn"
            extra="The day the car was registered in the system"
            rules={[{ required: true, message: "Registration date is required" }]}
          >
            <DatePicker
              format="D MMM YYYY"
              disabledDate={(day) => day.isAfter(dayjs(), "day")}
              allowClear={false}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Form.Item
            label="Mileage at registration"
            name="registeredMileage"
            extra="The reading on that day"
            rules={[{ required: true, message: "Mileage at registration is required" }]}
          >
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
