import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { PackageId } from "../data/content";

type UICtx = {
  toast: string | null;
  showToast: (msg: string) => void;
  orderPkg: PackageId | null;
  openOrder: (p: PackageId) => void;
  closeOrder: () => void;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
};

const Ctx = createContext<UICtx | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<string | null>(null);
  const [orderPkg, setOrderPkg] = useState<PackageId | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Lock page scroll while an overlay covers it (drawer, modal, full-screen chat on phones).
  useEffect(() => {
    const b = document.body;
    b.classList.toggle("lock", drawerOpen || orderPkg !== null);
    b.classList.toggle("chat-open", chatOpen);
  }, [drawerOpen, orderPkg, chatOpen]);

  // Escape closes every overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOrderPkg(null);
      setDrawerOpen(false);
      setChatOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo<UICtx>(
    () => ({
      toast,
      showToast,
      orderPkg,
      openOrder: (p) => setOrderPkg(p),
      closeOrder: () => setOrderPkg(null),
      chatOpen,
      setChatOpen,
      drawerOpen,
      setDrawerOpen
    }),
    [toast, showToast, orderPkg, chatOpen, drawerOpen]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUI(): UICtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useUI must be used inside <UIProvider>");
  return c;
}
