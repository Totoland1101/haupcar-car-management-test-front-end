"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout, Menu } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLayout } from "@/core/context/LayoutContext";
import useCar from "@/core/hooks/useCar";
import { selectedMenuKey } from "@/core/router/menu";
import { openMenuKeys, useMenuItems } from "./menuItems";

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useLayout();
  const items = useMenuItems();
  const { goToFirstPage } = useCar();

  return (
    <Layout.Sider
      className="app-sider"
      width={240}
      collapsedWidth={80}
      collapsible
      // Folds itself up on tablets and small laptops, so the page gets the room.
      breakpoint="lg"
      onBreakpoint={setCollapsed}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={
        <div className={collapsed ? "arrow-menu arrow-menu-collapsed" : "arrow-menu"}>
          <ArrowLeftOutlined />
        </div>
      }
    >
      <Link href="/" className={collapsed ? "sider-logo collapsed" : "sider-logo"} onClick={goToFirstPage}>
        <img src="/car.svg" alt="" width={32} height={32} />
        {!collapsed && <span>haupcar-management</span>}
      </Link>

      <div className="sider-menu custom-scrollbar dark">
        <Menu
          mode="inline"
          inlineIndent={16}
          items={items}
          selectedKeys={[selectedMenuKey(pathname)]}
          defaultOpenKeys={openMenuKeys}
        />
      </div>
    </Layout.Sider>
  );
}
