"use client";

import { useEffect, useState } from "react";
import { Badge, Button, Card, Modal, Popconfirm, Table, Tag, Tooltip, Typography, type TableProps } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/core/context/AuthContext";
import useUser from "@/core/hooks/useUser";
import type { User, UserPayload } from "@/core/services/user";
import { formatDateTime } from "@/core/utils/format";
import UserForm from "./Components/UserForm";

export default function UserList() {
  const { user: me } = useAuth();
  const { userList, loading, roleOptions, fetchUsers, fetchRoleOptions, saveUser, deleteUser } = useUser();
  const [editing, setEditing] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });

  useEffect(() => {
    fetchUsers();
    fetchRoleOptions();
  }, []);

  const closeForm = () => setEditing((prev) => ({ ...prev, open: false }));

  async function handleSubmit(payload: UserPayload) {
    const { success, error } = await saveUser(editing.user?.id ?? null, payload);
    if (!success) return error;
    closeForm();
    fetchUsers();
    return null;
  }

  async function handleDelete(user: User) {
    if (await deleteUser(user)) fetchUsers();
  }

  const columns: TableProps<User>["columns"] = [
    {
      title: "Username",
      dataIndex: "username",
      render: (username: string, user) => (
        <>
          {username}
          {user.id === me?.id && <Tag style={{ marginLeft: 8 }}>You</Tag>}
        </>
      ),
    },
    { title: "Name", dataIndex: "name" },
    {
      title: "Role",
      key: "role",
      render: (_, user) => (user.role ? <Tag color="blue">{user.role.name}</Tag> : "-"),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (isActive: boolean) =>
        isActive ? <Badge status="success" text="Active" /> : <Badge status="default" text="Disabled" />,
    },
    {
      title: "Last login",
      dataIndex: "lastLoginAt",
      render: (value: string | null) => (value ? formatDateTime(value) : "Never"),
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, user) => (
        <span className="row-actions">
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              aria-label="Edit"
              onClick={() => setEditing({ open: true, user })}
            />
          </Tooltip>
          {user.id === me?.id ? (
            <Tooltip title="You can't delete your own account">
              <Button danger icon={<DeleteOutlined />} aria-label="Delete" disabled />
            </Tooltip>
          ) : (
            <Popconfirm
              title="Delete this user?"
              description={`${user.username} will no longer be able to log in.`}
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(user)}
            >
              <Tooltip title="Delete">
                <Button danger icon={<DeleteOutlined />} aria-label="Delete" />
              </Tooltip>
            </Popconfirm>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Users" subtitle="People who can log in, and the role each one has" />

      <div className="page-stack">
        <Card size="small" className="toolbar-card">
          <div className="toolbar">
            <Typography.Text type="secondary">{userList.length} users</Typography.Text>
            <div className="toolbar-extra">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setEditing({ open: true, user: null })}>
                Add user
              </Button>
            </div>
          </div>
        </Card>
        <Card>
          <Table<User>
            rowKey="id"
            columns={columns}
            dataSource={userList}
            loading={loading}
            pagination={false}
            scroll={{ x: 760 }}
          />
        </Card>
      </div>

      <Modal
        open={editing.open}
        title={editing.user ? `Edit ${editing.user.username}` : "Add a user"}
        footer={null}
        onCancel={closeForm}
        destroyOnHidden
      >
        <UserForm
          user={editing.user}
          isSelf={!!editing.user && editing.user.id === me?.id}
          roleOptions={roleOptions}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>
    </>
  );
}
