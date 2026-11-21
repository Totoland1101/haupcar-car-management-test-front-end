"use client";

import { useEffect, useState } from "react";
import { Button, Card, Empty, Modal, Popconfirm, Segmented, Table, Typography, type TableProps } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import PageHeader from "@/components/PageHeader";
import useRegistration from "@/core/hooks/useRegistration";
import useUser from "@/core/hooks/useUser";
import type { RegistrationStatus } from "@/core/services/registration";
import type { User } from "@/core/services/user";
import { formatDateTime } from "@/core/utils/format";
import ApproveForm from "./Components/ApproveForm";

export default function Approval() {
  const { registrationList, counts, loading, fetchRegistrations, approve, reject } = useRegistration();
  const { roleOptions, fetchRoleOptions } = useUser();
  const [status, setStatus] = useState<RegistrationStatus>("pending");
  const [approving, setApproving] = useState<User | null>(null);

  useEffect(() => {
    fetchRegistrations(status);
  }, [status]);

  useEffect(() => {
    fetchRoleOptions();
  }, []);

  async function handleApprove(roleId: number) {
    if (!approving) return false;
    const { success } = await approve(approving, roleId);
    if (success) {
      setApproving(null);
      fetchRegistrations(status);
    }
    return success;
  }

  async function handleReject(user: User) {
    if (await reject(user)) fetchRegistrations(status);
  }

  const columns: TableProps<User>["columns"] = [
    { title: "Name", dataIndex: "name" },
    { title: "Username", dataIndex: "username" },
    { title: "Registered", dataIndex: "createdAt", render: formatDateTime },
    ...(status === "rejected"
      ? [
          {
            title: "Rejected",
            key: "reviewed",
            render: (_: unknown, user: User) => (
              <>
                {formatDateTime(user.reviewedAt)}
                {user.reviewedBy && (
                  <div>
                    <Typography.Text type="secondary">by {user.reviewedBy.name}</Typography.Text>
                  </div>
                )}
              </>
            ),
          },
        ]
      : []),
    {
      title: "",
      key: "actions",
      align: "right",
      render: (_, user) => (
        <span className="row-actions">
          <Button type="primary" icon={<CheckOutlined />} onClick={() => setApproving(user)}>
            Approve
          </Button>
          {user.status === "pending" && (
            <Popconfirm
              title="Reject this registration?"
              description={`${user.username} won't be able to log in. You can still approve it later.`}
              okText="Reject"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleReject(user)}
            >
              <Button danger icon={<CloseOutlined />}>
                Reject
              </Button>
            </Popconfirm>
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Approvals" subtitle="People who registered and are waiting to be let in" />

      <div className="page-stack">
        <Card size="small" className="toolbar-card">
          <Segmented<RegistrationStatus>
            value={status}
            onChange={setStatus}
            options={[
              { value: "pending", label: `Waiting (${counts.pending})` },
              { value: "rejected", label: `Rejected (${counts.rejected})` },
            ]}
          />
        </Card>
        <Card>
          <Table<User>
            rowKey="id"
            columns={columns}
            dataSource={registrationList}
            loading={loading}
            pagination={false}
            scroll={{ x: 720 }}
            locale={{
              emptyText: (
                <Empty
                  description={status === "pending" ? "Nobody is waiting for approval" : "No rejected registrations"}
                />
              ),
            }}
          />
        </Card>
      </div>

      <Modal
        open={!!approving}
        title={approving ? `Approve ${approving.username}` : ""}
        footer={null}
        onCancel={() => setApproving(null)}
        destroyOnHidden
      >
        {approving && (
          <ApproveForm
            user={approving}
            roleOptions={roleOptions}
            onSubmit={handleApprove}
            onCancel={() => setApproving(null)}
          />
        )}
      </Modal>
    </>
  );
}
