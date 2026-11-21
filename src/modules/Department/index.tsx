"use client";

import { useEffect, useState } from "react";
import { Button, Card, Modal, Popconfirm, Table, Tooltip, Typography, type TableProps } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";
import useDepartment from "@/core/hooks/useDepartment";
import type { DepartmentRow } from "@/core/services/department";
import DepartmentForm from "./Components/DepartmentForm";

export default function DepartmentList() {
  const { departmentList, loading, fetchDepartments, saveDepartment, deleteDepartment } = useDepartment();
  const [editing, setEditing] = useState<{ open: boolean; department: DepartmentRow | null }>({
    open: false,
    department: null,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const closeForm = () => setEditing((prev) => ({ ...prev, open: false }));

  async function handleSubmit(name: string) {
    const { success, error } = await saveDepartment(editing.department?.id ?? null, name);
    if (!success) return error;
    closeForm();
    fetchDepartments();
    return null;
  }

  async function handleDelete(department: DepartmentRow) {
    if (await deleteDepartment(department)) fetchDepartments();
  }

  const columns: TableProps<DepartmentRow>["columns"] = [
    { title: "Department", dataIndex: "name" },
    { title: "People", dataIndex: "userCount", align: "right", width: 100 },
    {
      title: "",
      key: "actions",
      align: "right",
      width: 120,
      render: (_, department) => (
        <span className="row-actions">
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} aria-label="Edit" onClick={() => setEditing({ open: true, department })} />
          </Tooltip>
          <Popconfirm
            title="Delete this department?"
            description={
              department.userCount
                ? `${department.userCount} people will have no department.`
                : `${department.name} will be removed.`
            }
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(department)}
          >
            <Tooltip title="Delete">
              <Button danger icon={<DeleteOutlined />} aria-label="Delete" />
            </Tooltip>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Departments" subtitle="Departments people can pick on their profile" />

      <div className="page-stack">
        <Card size="small" className="toolbar-card">
          <div className="toolbar">
            <Typography.Text type="secondary">{departmentList.length} departments</Typography.Text>
            <div className="toolbar-extra">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setEditing({ open: true, department: null })}
              >
                Add department
              </Button>
            </div>
          </div>
        </Card>
        <Card>
          <Table<DepartmentRow>
            rowKey="id"
            columns={columns}
            dataSource={departmentList}
            loading={loading}
            pagination={false}
          />
        </Card>
      </div>

      <Modal
        open={editing.open}
        title={editing.department ? `Edit ${editing.department.name}` : "Add a department"}
        footer={null}
        onCancel={closeForm}
        destroyOnHidden
      >
        <DepartmentForm department={editing.department} onSubmit={handleSubmit} onCancel={closeForm} />
      </Modal>
    </>
  );
}
