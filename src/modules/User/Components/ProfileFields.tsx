import { Col, Form, Input, Row, Select } from "antd";

interface ProfileFieldsProps {
  /** Where the fields sit in the form values, e.g. ["profile"] in the user form */
  prefix?: string[];
  departmentOptions: { value: number; label: string }[];
}

// The profile part of a form. Used by the user form and by My profile.
export default function ProfileFields({ prefix = [], departmentOptions }: ProfileFieldsProps) {
  const name = (field: string) => [...prefix, field];

  return (
    <Row gutter={16}>
      <Col xs={24} sm={12}>
        <Form.Item
          label="First name"
          name={name("firstName")}
          rules={[{ required: true, whitespace: true, message: "First name is required" }, { max: 100 }]}
        >
          <Input maxLength={100} autoComplete="given-name" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Last name" name={name("lastName")} rules={[{ max: 100 }]}>
          <Input maxLength={100} autoComplete="family-name" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Email" name={name("email")} rules={[{ type: "email", message: "Email is not valid" }, { max: 255 }]}>
          <Input maxLength={255} autoComplete="email" placeholder="name@example.com" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item
          label="Phone"
          name={name("phone")}
          rules={[{ pattern: /^[0-9+\-() ]+$/, message: "Use digits, spaces and + - ( )" }, { max: 30 }]}
        >
          <Input maxLength={30} autoComplete="tel" placeholder="e.g. 081 234 5678" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Job title" name={name("jobTitle")} rules={[{ max: 100 }]}>
          <Input maxLength={100} placeholder="e.g. Fleet coordinator" />
        </Form.Item>
      </Col>
      <Col xs={24} sm={12}>
        <Form.Item label="Department" name={name("departmentId")}>
          <Select options={departmentOptions} placeholder="No department" allowClear showSearch optionFilterProp="label" />
        </Form.Item>
      </Col>
    </Row>
  );
}
