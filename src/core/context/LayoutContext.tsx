"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// At 768px and below the sidebar becomes a burger menu.
const MOBILE_MAX_WIDTH = 768;

interface LayoutContextProps {
  isMobile: boolean;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const value = useMemo(() => ({ isMobile, collapsed, setCollapsed }), [isMobile, collapsed]);

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout(): LayoutContextProps {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within LayoutProvider");
  }
  return context;
}
