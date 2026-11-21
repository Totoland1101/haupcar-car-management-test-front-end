"use client";

import { useEffect, useState } from "react";
import { App, Button, Card, Descriptions, Form, Modal, Tag } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/core/context/AuthContext";
import AuthService from "@/core/services/auth";
import useDepartment from "@/core/hooks/useDepartment";
import type { ProfilePayload } from "@/core/services/user";
import PasswordForm, { type PasswordValues } from "../User/Components/PasswordForm";
import ProfileFields from "../User/Components/ProfileFields";
import { toProfilePayload } from "../User/Components/UserForm";

// The logged-in user's own details. The role and username are shown but can only be
// changed by an admin on the Users page.
export default function MyProfile() {
  const { message } = App.useApp();
  const { user, updateProfile } = useAuth();
  const { departmentOptions, fetchDepartments } = useDepartment();
  const [form] = Form.useForm<Partial<ProfilePayload>>();
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  if (!user) return null;

  async function handlePassword({ currentPassword, newPassword }: PasswordValues) {
    const { success, error } = await AuthService.changeMyPassword(currentPassword ?? "", newPassword);
    if (!success) return error;
    setChangingPassword(false);
    message.success("Your password has been changed");
    return null;
  }

  async function handleFinish(values: Partial<ProfilePayload>) {
    setSaving(true);
    const { success, error } = await updateProfile(toProfilePayload(values));
    setSaving(false);
    if (success) {
      message.success("Saved your profile");
      return;
    }
    if (error.details.length) {
      form.setFields(error.details.map(({ field, message: text }) => ({ name: field as keyof ProfilePayload, errors: [text] })));
    }
    message.error(error.message);
  }

  return (
    <>
      <PageHeader title="My profile" subtitle="Your details as other people in the system see them" />

      <div className="page-stack">
        <Card
          size="small"
          title="Account"
          extra={
            <Button icon={<KeyOutlined />} onClick={() => setChangingPassword(true)}>
              Change password
            </Button>
          }
        >
          <Descriptions
            column={{ xs: 1, sm: 2 }}
            items={[
              { key: "username", label: "Username", children: user.username },
              { key: "role", label: "Role", children: <Tag color="blue">{user.role.name}</Tag> },
            ]}
          />
        </Card>

        <Card>
          <Form<Partial<ProfilePayload>>
            form={form}
            layout="vertical"
            requiredMark="optional"
            initialValues={{
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
              email: user.profile.email,
              phone: user.profile.phone,
              jobTitle: user.profile.jobTitle,
              departmentId: user.profile.department?.id ?? null,
            }}
            onFinish={handleFinish}
          >
            <ProfileFields departmentOptions={departmentOptions} />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="primary" htmlType="submit" loading={saving}>
                Save changes
              </Button>
            </div>
          </Form>
        </Card>
      </div>

      <Modal
        open={changingPassword}
        title="Change your password"
        footer={null}
        onCancel={() => setChangingPassword(false)}
        destroyOnHidden
      >
        <PasswordForm askCurrent onSubmit={handlePassword} onCancel={() => setChangingPassword(false)} />
      </Modal>
    </>
  );
}
