import type { ReactNode } from "react";

// Full-screen backdrop with a card on the right, for the pages shown before logging in.
export default function SideLayout({ children }: { children: ReactNode }) {
  return (
    <div className="side-layout">
      <div className="side-layout-brand">
        <img src="/car.svg" alt="" width={64} height={64} />
        <h1>haupcar-management</h1>
        <p>Record and manage the company&apos;s cars in one place.</p>
      </div>
      <div className="side-layout-content">
        <div className="side-layout-card">{children}</div>
      </div>
    </div>
  );
}
