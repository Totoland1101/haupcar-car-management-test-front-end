"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { Layout } from "antd";
import { PERMISSIONS } from "@/core/constants/permission";
import { useAuth } from "@/core/context/AuthContext";
import { useLayout } from "@/core/context/LayoutContext";
import useCar from "@/core/hooks/useCar";
import useRegistration from "@/core/hooks/useRegistration";
import Header from "../Header";
import BurgerMenu from "./BurgerMenu";
import Sidebar from "./Sidebar";

// Dark sidebar on the left, a slim header on top and the page scrolling underneath.
// On mobile the sidebar moves into a burger menu.
export default function AppLayout({ children }: { children: ReactNode }) {
  const { isMobile } = useLayout();
  const { hasPermission } = useAuth();
  const { fetchCounts } = useRegistration();
  const { goToFirstPage } = useCar();
  const canApprove = hasPermission(PERMISSIONS.USER_APPROVE);

  // For the badge on the Approvals menu item
  useEffect(() => {
    if (canApprove) fetchCounts();
  }, [canApprove]);

  return (
    <Layout className="layout-container">
      {!isMobile && <Sidebar />}
      <Layout>
        <Header
          left={
            isMobile && (
              <div className="header-left">
                <BurgerMenu />
                <Link href="/" className="mobile-logo" onClick={goToFirstPage}>
                  <img src="/car.svg" alt="" width={26} height={26} />
                  <span>haupcar-management</span>
                </Link>
              </div>
            )
          }
        />
        <Layout.Content className="main-content">
          <div className="page">{children}</div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
