"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type State = Record<string, unknown>;

interface DataContextProps {
  state: State;
  /** Merges `values` into state[namespace], or into the top level when no namespace is given. */
  updateState: (values: object, namespace?: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

// Shared state for the core/hooks. Each hook keeps its data under its own namespace.
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({});

  const updateState = useCallback((values: object, namespace?: string) => {
    setState((prev) => {
      if (namespace) {
        return { ...prev, [namespace]: { ...(prev[namespace] as object | undefined), ...values } };
      }
      return { ...prev, ...values };
    });
  }, []);

  const contextValue = useMemo(() => ({ state, updateState }), [state, updateState]);

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
}

export function useDataContext(): DataContextProps {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within DataProvider");
  }
  return context;
}
