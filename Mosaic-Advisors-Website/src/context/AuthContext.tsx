import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { store } from "../lib/storage";
import { hashPassword } from "../lib/hash";
import type { PackageId } from "../data/content";
import type { TKey } from "../i18n";

export type Dept = "support" | "services" | "finance" | "problem";
export type OrderStatus = "pending" | "cancelled";

export interface Order {
  id: string;
  date: string;
  pkg: PackageId;
  status: OrderStatus;
  name: string;
  email: string;
  phone: string;
  note: string;
}
export interface Message {
  id: string;
  date: string;
  dept: Dept;
  msg: string;
  name: string;
  email: string;
  phone: string;
}
export interface User {
  name: string;
  pass: string;
  phone: string;
  company: string;
  orders: Order[];
  msgs: Message[];
}
interface Bucket {
  orders: Order[];
  msgs: Message[];
}

type AuthCtx = {
  user: User | null;
  email: string | null;
  register: (name: string, email: string, pass: string) => Promise<TKey | null>;
  login: (email: string, pass: string) => Promise<TKey | null>;
  logout: () => void;
  updateProfile: (p: Pick<User, "name" | "phone" | "company">) => void;
  deleteAccount: () => void;
  addOrder: (o: Omit<Order, "id" | "date" | "status">) => void;
  cancelOrder: (id: string) => void;
  addMessage: (m: Omit<Message, "id" | "date">) => void;
};

const Ctx = createContext<AuthCtx | null>(null);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const norm = (e: string) => e.trim().toLowerCase();

/** Defensive loader: ignores malformed data left in storage by older versions. */
function loadUsers(): Record<string, User> {
  const raw = store.get<Record<string, Partial<User>>>("users", {});
  const out: Record<string, User> = {};
  if (raw && typeof raw === "object") {
    for (const [k, u] of Object.entries(raw)) {
      if (!u || typeof u !== "object" || typeof u.name !== "string" || typeof u.pass !== "string") continue;
      out[k] = {
        name: u.name,
        pass: u.pass,
        phone: u.phone ?? "",
        company: u.company ?? "",
        orders: Array.isArray(u.orders) ? u.orders.map((o) => ({ ...o, id: o.id ?? uid() })) : [],
        msgs: Array.isArray(u.msgs) ? u.msgs.map((m) => ({ ...m, id: m.id ?? uid() })) : []
      };
    }
  }
  return out;
}
function loadGuest(): Bucket {
  const g = store.get<Partial<Bucket>>("guest", {});
  return { orders: Array.isArray(g?.orders) ? g.orders : [], msgs: Array.isArray(g?.msgs) ? g.msgs : [] };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<Record<string, User>>(loadUsers);
  const [email, setEmail] = useState<string | null>(() => {
    const s = store.get<string | null>("session", null);
    return typeof s === "string" ? s : null;
  });
  const [guest, setGuest] = useState<Bucket>(loadGuest);

  useEffect(() => store.set("users", users), [users]);
  useEffect(() => store.set("session", email), [email]);
  useEffect(() => store.set("guest", guest), [guest]);

  // Session pointing at a deleted / missing account → log out.
  useEffect(() => {
    if (email && !users[email]) setEmail(null);
  }, [email, users]);

  const user = email ? users[email] ?? null : null;

  const patchUser = useCallback(
    (fn: (u: User) => User) => {
      if (!email) return;
      setUsers((all) => (all[email] ? { ...all, [email]: fn(all[email]) } : all));
    },
    [email]
  );

  const register = useCallback<AuthCtx["register"]>(
    async (name, rawEmail, pass) => {
      const e = norm(rawEmail);
      if (users[e]) return "exists";
      const h = await hashPassword(pass);
      // Anything the visitor did as a guest moves into the new account.
      setUsers((all) => ({ ...all, [e]: { name: name.trim(), pass: h, phone: "", company: "", orders: guest.orders, msgs: guest.msgs } }));
      setGuest({ orders: [], msgs: [] });
      setEmail(e);
      return null;
    },
    [users, guest]
  );

  const login = useCallback<AuthCtx["login"]>(
    async (rawEmail, pass) => {
      const e = norm(rawEmail);
      const h = await hashPassword(pass);
      if (!users[e] || users[e].pass !== h) return "no_acc";
      setEmail(e);
      return null;
    },
    [users]
  );

  const logout = useCallback(() => setEmail(null), []);

  const updateProfile = useCallback<AuthCtx["updateProfile"]>(
    (p) => patchUser((u) => ({ ...u, name: p.name.trim(), phone: p.phone.trim(), company: p.company.trim() })),
    [patchUser]
  );

  const deleteAccount = useCallback(() => {
    if (!email) return;
    setUsers((all) => {
      const next = { ...all };
      delete next[email];
      return next;
    });
    setEmail(null);
  }, [email]);

  const addOrder = useCallback<AuthCtx["addOrder"]>(
    (o) => {
      const order: Order = { ...o, id: uid(), date: new Date().toISOString(), status: "pending" };
      if (email && users[email]) patchUser((u) => ({ ...u, orders: [...u.orders, order] }));
      else setGuest((g) => ({ ...g, orders: [...g.orders, order] }));
    },
    [email, users, patchUser]
  );

  const cancelOrder = useCallback<AuthCtx["cancelOrder"]>(
    (id) => patchUser((u) => ({ ...u, orders: u.orders.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)) })),
    [patchUser]
  );

  const addMessage = useCallback<AuthCtx["addMessage"]>(
    (m) => {
      const msg: Message = { ...m, id: uid(), date: new Date().toISOString() };
      if (email && users[email]) patchUser((u) => ({ ...u, msgs: [...u.msgs, msg] }));
      else setGuest((g) => ({ ...g, msgs: [...g.msgs, msg] }));
    },
    [email, users, patchUser]
  );

  const value = useMemo<AuthCtx>(
    () => ({ user, email: user ? email : null, register, login, logout, updateProfile, deleteAccount, addOrder, cancelOrder, addMessage }),
    [user, email, register, login, logout, updateProfile, deleteAccount, addOrder, cancelOrder, addMessage]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside <AuthProvider>");
  return c;
}
