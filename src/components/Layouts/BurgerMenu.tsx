"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Drawer, Menu } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import variable from "@/core/constants/theme/variable";
import useCar from "@/core/hooks/useCar";
import { selectedMenuKey } from "@/core/router/menu";
import { openMenuKeys, useMenuItems } from "./menuItems";

// The sidebar menu in a drawer, for screens too narrow for the sidebar.
export default function BurgerMenu() {
  const pathname = usePathname();
  const items = useMenuItems();
  const { goToFirstPage } = useCar();
  const [open, setOpen] = useState(false);

  // Close after picking a page.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <Button type="text" aria-label="Open menu" icon={<MenuOutlined />} onClick={() => setOpen(true)} />
      <Drawer
        className="mobile-nav"
        placement="left"
        size={260}
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={false}
        title={
          <div className="mobile-nav-title">
            <Link href="/" className="sider-logo" onClick={goToFirstPage}>
              <img src="/car.svg" alt="" width={28} height={28} />
              <span>haupcar-management</span>
            </Link>
            <Button
              type="text"
              aria-label="Close menu"
              icon={<CloseOutlined style={{ color: variable.color.white }} />}
              onClick={() => setOpen(false)}
            />
          </div>
        }
        styles={{
          header: { background: variable.color.secondary, padding: "4px 8px 4px 16px" },
          body: { background: variable.color.secondary, padding: 0 },
        }}
      >
        <Menu
          mode="inline"
          inlineIndent={16}
          items={items}
          selectedKeys={[selectedMenuKey(pathname)]}
          defaultOpenKeys={openMenuKeys}
        />
      </Drawer>
    </>
  );
}
