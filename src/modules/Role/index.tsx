"use client";

import { useEffect, useState } from "react";
import { Button, Card, Modal, Popconfirm, Table, Tag, Tooltip, Typography, type TableProps } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";
import useRole from "@/core/hooks/useRole";
import type { Role, RolePayload } from "@/core/services/role";
import RoleForm from "./Components/RoleForm";

export default function RoleList() {
  const { roleList, permissionList, loading, fetchRoles, fetchPermissions, saveRole, deleteRole } = useRole();
  const [editing, setEditing] = useState<{ open: boolean; role: Role | null }>({ open: false, role: null });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const permissionName = new Map(permissionList.map((permission) => [permission.code, permission.name]));
  const closeForm = () => setEditing((prev) => ({ ...prev, open: false }));

  async function handleSubmit(payload: RolePayload) {
    const { success, error } = await saveRole(editing.role?.id ?? null, payload);
    if (!success) return error;
    closeForm();
    fetchRoles();
    return null;
  }

  async function handleDelete(role: Role) {
    if (await deleteRole(role)) fetchRoles();
  }

  const columns: TableProps<Role>["columns"] = [
    {
      title: "Role",
      dataIndex: "name",
      width: 220,
      render: (name: string, role) => (
        <>
          <Typography.Text strong>{name}</Typography.Text>
          {role.isSystem && <Tag style={{ marginLeft: 8 }}>System</Tag>}
          {role.description && (
            <div>
              <Typography.Text type="secondary">{role.description}</Typography.Text>
            </div>
          )}
        </>
      ),
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      render: (codes: Role["permissions"]) =>
        codes.length ? (
          <div className="tag-list">
            {codes.map((code) => (
              <Tag key={code}>{permissionName.get(code) ?? code}</Tag>
            ))}
          </div>
        ) : (
          <Typography.Text type="secondary">None</Typography.Text>
        ),
    },
    { title: "Users", dataIndex: "userCount", align: "right", width: 80 },
    {
      title: "",
      key: "actions",
      align: "right",
      width: 100,
      render: (_, role) =>
        role.isSystem ? (
          <Tooltip title="The Admin role always has every permission">
            <Typography.Text type="secondary">Locked</Typography.Text>
          </Tooltip>
        ) : (
          <span style={{ whiteSpace: "nowrap" }}>
            <Tooltip title="Edit">
              <Button
                type="text"
                icon={<EditOutlined />}
                aria-label="Edit"
                onClick={() => setEditing({ open: true, role })}
              />
            </Tooltip>
            <Popconfirm
              title="Delete this role?"
              description={
                role.userCount
                  ? `${role.userCount} user(s) still have it. Move them to another role first.`
                  : `The ${role.name} role will be removed.`
              }
              okText="Delete"
              okButtonProps={{ danger: true, disabled: role.userCount > 0 }}
              onConfirm={() => handleDelete(role)}
            >
              <Tooltip title="Delete">
                <Button type="text" danger icon={<DeleteOutlined />} aria-label="Delete" />
              </Tooltip>
            </Popconfirm>
          </span>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Roles"
        subtitle="Each role is a set of permissions. Every user has one role."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setEditing({ open: true, role: null })}>
            Add role
          </Button>
        }
      />

      <Card>
        <Table<Role>
          rowKey="id"
          columns={columns}
          dataSource={roleList}
          loading={loading}
          pagination={false}
          scroll={{ x: 760 }}
        />
      </Card>

      <Modal
        open={editing.open}
        title={editing.role ? `Edit the ${editing.role.name} role` : "Add a role"}
        footer={null}
        onCancel={closeForm}
        destroyOnHidden
        width={560}
      >
        <RoleForm
          role={editing.role}
          permissionList={permissionList}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>
    </>
  );
}
