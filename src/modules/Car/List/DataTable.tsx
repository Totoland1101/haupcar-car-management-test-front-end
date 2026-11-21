import { useRouter } from "next/navigation";
import { Button, Empty, Popconfirm, Table, Tooltip, type TableProps } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import PermissionWrapper from "@/components/PermissionWrapper";
import { PERMISSIONS } from "@/core/constants/permission";
import type { Car } from "@/core/services/car";
import { formatDateTime, formatMileage, orDash } from "@/core/utils/format";
import type { ListQuery } from "@/core/utils/listQuery";
import LicensePlate from "../Components/LicensePlate";
import StatusTag from "../Components/StatusTag";
import type { QueryChanges } from ".";

interface DataTableProps {
  query: ListQuery;
  cars: Car[];
  total: number;
  loading: boolean;
  onChange: (changes: QueryChanges) => void;
  onDelete: (car: Car) => void;
}

function sortOrderFor(query: ListQuery, field: string) {
  if (query.sortBy !== field) return null;
  return query.order === "asc" ? "ascend" : "descend";
}

export default function DataTable({ query, cars, total, loading, onChange, onDelete }: DataTableProps) {
  const router = useRouter();

  const handleTableChange: TableProps<Car>["onChange"] = (pagination, _filters, sorter, { action }) => {
    const active = Array.isArray(sorter) ? sorter[0] : sorter;
    const sorted = Boolean(active?.order);
    onChange({
      // A new sort order starts again from the first page.
      page: action === "sort" ? undefined : pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorted ? String(active.columnKey) : undefined,
      order: sorted ? (active.order === "ascend" ? "asc" : "desc") : undefined,
    });
  };

  const columns: TableProps<Car>["columns"] = [
    {
      title: "Registration",
      key: "registrationNumber",
      sorter: true,
      sortOrder: sortOrderFor(query, "registrationNumber"),
      render: (_, car) => <LicensePlate number={car.registrationNumber} province={car.province} />,
    },
    {
      title: "Brand",
      key: "brand",
      dataIndex: "brand",
      sorter: true,
      sortOrder: sortOrderFor(query, "brand"),
    },
    {
      title: "Model",
      key: "model",
      dataIndex: "model",
      sorter: true,
      sortOrder: sortOrderFor(query, "model"),
    },
    {
      title: "Year",
      key: "year",
      dataIndex: "year",
      sorter: true,
      sortOrder: sortOrderFor(query, "year"),
      render: orDash,
    },
    {
      title: "Color",
      key: "color",
      dataIndex: "color",
      render: orDash,
    },
    {
      title: "Mileage",
      key: "mileage",
      dataIndex: "mileage",
      align: "right",
      sorter: true,
      sortOrder: sortOrderFor(query, "mileage"),
      render: formatMileage,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => <StatusTag status={status} />,
    },
    {
      title: "Last updated",
      key: "updatedAt",
      dataIndex: "updatedAt",
      sorter: true,
      sortOrder: sortOrderFor(query, "updatedAt"),
      render: formatDateTime,
    },
    {
      title: "",
      key: "actions",
      align: "right",
      onCell: () => ({ onClick: (e) => e.stopPropagation() }),
      render: (_, car) => (
        <span className="row-actions">
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              aria-label="View"
              onClick={() => router.push(`/cars/${car.id}`)}
            />
          </Tooltip>
          <PermissionWrapper permission={PERMISSIONS.CAR_UPDATE}>
            <Tooltip title="Edit">
              <Button
                icon={<EditOutlined />}
                aria-label="Edit"
                onClick={() => router.push(`/cars/${car.id}/edit`)}
              />
            </Tooltip>
          </PermissionWrapper>
          <PermissionWrapper permission={PERMISSIONS.CAR_DELETE}>
            <Popconfirm
              title="Delete this car?"
              description={`${car.registrationNumber} ${car.province} will be removed for good.`}
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(car)}
            >
              <Tooltip title="Delete">
                <Button danger icon={<DeleteOutlined />} aria-label="Delete" />
              </Tooltip>
            </Popconfirm>
          </PermissionWrapper>
        </span>
      ),
    },
  ];

  return (
    <Table<Car>
      rowKey="id"
      columns={columns}
      dataSource={cars}
      loading={loading}
      scroll={{ x: 960 }}
      onChange={handleTableChange}
      onRow={(car) => ({
        className: "clickable-row",
        onClick: () => router.push(`/cars/${car.id}`),
      })}
      locale={{ emptyText: <Empty description="No cars match these filters" /> }}
      pagination={{
        current: query.page,
        pageSize: query.pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
        showTotal: (count, [from, to]) => `${from}-${to} of ${count} cars`,
      }}
    />
  );
}
