import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumb, Typography } from "antd";

export interface BreadcrumbItem {
  title: ReactNode;
  /** Leave out for the current page, which is not a link */
  to?: string;
}

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
  extra?: ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumb, extra }: PageHeaderProps) {
  return (
    <>
      {breadcrumb && (
        <Breadcrumb
          items={breadcrumb.map(({ title: label, to }) => ({
            title: to ? <Link href={to}>{label}</Link> : label,
          }))}
        />
      )}
      <div className="page-header">
        <div>
          <Typography.Title level={3}>{title}</Typography.Title>
          {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
        </div>
        {extra}
      </div>
    </>
  );
}
