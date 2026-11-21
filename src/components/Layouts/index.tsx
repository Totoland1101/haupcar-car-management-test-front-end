"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Layout } from "antd";
import { useLayout } from "@/core/context/LayoutContext";
import Header from "../Header";
import BurgerMenu from "./BurgerMenu";
import Sidebar from "./Sidebar";

// Dark sidebar on the left, a slim header on top and the page scrolling underneath.
// On mobile the sidebar moves into a burger menu.
export default function AppLayout({ children }: { children: ReactNode }) {
  const { isMobile } = useLayout();

  return (
    <Layout className="layout-container">
      {!isMobile && <Sidebar />}
      <Layout>
        <Header
          left={
            isMobile && (
              <div className="header-left">
                <BurgerMenu />
                <Link href="/" className="mobile-logo">
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
