import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useLang } from "../i18n";
import { useAuth, type Message, type Order } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { PACKAGES } from "../data/content";
import { focusFirstError, validate, type Errors } from "../lib/validation";
import { Field, PageHero } from "../components/ui";

/* ---------------- Login / Register ---------------- */
type AF = { name: string; email: string; pass: string };

function AuthForms() {
  const { t } = useLang();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState<AF>({ name: "", email: "", pass: "" });
  const [err, setErr] = useState<Errors<keyof AF>>({});
  const [formErr, setFormErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setErr({});
    setFormErr(null);
  };
  const set = (k: keyof AF, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErr((e) => ({ ...e, [k]: undefined }));
    setFormErr(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const errors = validate<keyof AF>(f, mode === "register" ? { name: "req", email: "email", pass: "pass" } : { email: "email", pass: "pass" });
    setErr(errors);
    if (Object.keys(errors).length) {
      focusFirstError(formRef.current);
      return;
    }
    setBusy(true);
    const res = mode === "register" ? await register(f.name, f.email, f.pass) : await login(f.email, f.pass);
    setBusy(false);
    if (res) setFormErr(t(res));
  };

  return (
    <div className="acc-wrap">
      <div className="tabs" role="tablist">
        {(["login", "register"] as const).map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} className={mode === m ? "on" : ""} onClick={() => switchMode(m)}>
            {t(m)}
          </button>
        ))}
      </div>
      <form noValidate onSubmit={submit} ref={formRef}>
        {mode === "register" && (
          <Field id={`${id}n`} label={t("f_name")} error={err.name}>
            <input id={`${id}n`} autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!err.name} />
          </Field>
        )}
        <Field id={`${id}e`} label={t("f_email")} error={err.email}>
          <input id={`${id}e`} type="email" autoComplete="username" value={f.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!err.email} />
        </Field>
        <Field id={`${id}p`} label={t("password")} error={err.pass}>
          <input
            id={`${id}p`}
            type="password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            value={f.pass}
            onChange={(e) => set("pass", e.target.value)}
            aria-invalid={!!err.pass}
          />
        </Field>
        {formErr && (
          <div className="acc-err" role="alert">
            {formErr}
          </div>
        )}
        <button type="submit" className="btn btn-navy btn-block" disabled={busy}>
          {t(mode)}
        </button>
      </form>
      <p className="demo-note">{t("demo_acc")}</p>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
type Tab = "over" | "orders" | "msgs" | "prof";

function OrdersTable({ orders }: { orders: Order[] }) {
  const { t, L, fmtDate } = useLang();
  const { cancelOrder } = useAuth();
  if (!orders.length)
    return (
      <div className="empty">
        {t("no_orders")}
        <br />
        <br />
        <a href="#packages" className="btn btn-gold">{t("browse")}</a>
      </div>
    );
  const pkgName = (id: string) => {
    const p = PACKAGES.find((x) => x.id === id);
    return p ? `„${L(p).n}“` : id;
  };
  return (
    <div className="tscroll">
      <table className="t">
        <thead>
          <tr>
            <th>{t("th_date")}</th>
            <th>{t("th_item")}</th>
            <th>{t("th_status")}</th>
            <th aria-label="actions" />
          </tr>
        </thead>
        <tbody>
          {[...orders].reverse().map((o) => (
            <tr key={o.id}>
              <td data-l={t("th_date")}>{fmtDate(o.date)}</td>
              <td data-l={t("th_item")}>
                <b>{pkgName(o.pkg)}</b>
                {o.note && <div className="sub-note">{o.note}</div>}
              </td>
              <td data-l={t("th_status")}>
                <span className={`pill ${o.status === "pending" ? "p" : "x"}`}>{o.status === "pending" ? t("s_pending") : t("s_cancel")}</span>
              </td>
              <td>
                {o.status === "pending" && (
                  <button type="button" className="link-btn" onClick={() => cancelOrder(o.id)}>
                    {t("cancel")}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MsgsTable({ msgs }: { msgs: Message[] }) {
  const { t, fmtDate } = useLang();
  if (!msgs.length) return <div className="empty">{t("no_msgs")}</div>;
  return (
    <div className="tscroll">
      <table className="t">
        <thead>
          <tr>
            <th>{t("th_date")}</th>
            <th>{t("th_dept")}</th>
            <th>{t("th_msg")}</th>
          </tr>
        </thead>
        <tbody>
          {[...msgs].reverse().map((m) => (
            <tr key={m.id}>
              <td data-l={t("th_date")} className="nowrap">{fmtDate(m.date)}</td>
              <td data-l={t("th_dept")}>{t(`d_${m.dept}`)}</td>
              <td data-l={t("th_msg")} className="msg-cell">{m.msg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type PF = { name: string; phone: string; company: string };

function Profile() {
  const { t } = useLang();
  const { user, email, updateProfile, deleteAccount } = useAuth();
  const { showToast } = useUI();
  const id = useId();
  const [f, setF] = useState<PF>({ name: user?.name ?? "", phone: user?.phone ?? "", company: user?.company ?? "" });
  const [err, setErr] = useState<Errors<keyof PF>>({});
  const [confirm, setConfirm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!confirm) return;
    const x = window.setTimeout(() => setConfirm(false), 4000);
    return () => window.clearTimeout(x);
  }, [confirm]);

  const set = (k: keyof PF, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErr((e) => ({ ...e, [k]: undefined }));
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errors = validate<keyof PF>(f, { name: "req", phone: "phoneopt" });
    setErr(errors);
    if (Object.keys(errors).length) {
      focusFirstError(formRef.current);
      return;
    }
    updateProfile(f);
    showToast(t("saved"));
  };

  return (
    <>
      <h3>{t("d_prof")}</h3>
      <p className="sub">{email}</p>
      <form noValidate onSubmit={submit} ref={formRef} className="prof-form">
        <Field id={`${id}n`} label={t("f_name")} error={err.name}>
          <input id={`${id}n`} autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!err.name} />
        </Field>
        <Field id={`${id}p`} label={t("f_phone")} error={err.phone}>
          <input id={`${id}p`} type="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!err.phone} />
        </Field>
        <Field id={`${id}c`} label={t("f_company")}>
          <input id={`${id}c`} autoComplete="organization" value={f.company} onChange={(e) => set("company", e.target.value)} />
        </Field>
        <div className="prof-actions">
          <button type="submit" className="btn btn-navy">{t("save")}</button>
          <button type="button" className="link-btn" onClick={() => (confirm ? deleteAccount() : setConfirm(true))}>
            {confirm ? t("confirm_del") : t("del_acc")}
          </button>
        </div>
      </form>
    </>
  );
}

function Dashboard() {
  const { t } = useLang();
  const { user, email, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("over");
  if (!user) return null;
  const open = user.orders.filter((o) => o.status === "pending").length;
  const tabs: [Tab, "d_over" | "d_orders" | "d_msgs" | "d_prof"][] = [
    ["over", "d_over"],
    ["orders", "d_orders"],
    ["msgs", "d_msgs"],
    ["prof", "d_prof"]
  ];
  return (
    <div className="dash">
      <aside>
        <div className="who">
          <div className="av">{(user.name.charAt(0) || "?").toUpperCase()}</div>
          <div>
            <b>{user.name}</b>
            <small>{email}</small>
          </div>
        </div>
        {tabs.map(([k, l]) => (
          <button key={k} type="button" className={tab === k ? "on" : ""} aria-current={tab === k} onClick={() => setTab(k)}>
            {t(l)}
          </button>
        ))}
        <button type="button" className="logout" onClick={logout}>
          {t("logout")} →
        </button>
      </aside>
      <div className="dpanel">
        {tab === "over" && (
          <>
            <h3>
              {t("welcome")}, {user.name.split(" ")[0]}!
            </h3>
            <p className="sub">{t("over_sub")}</p>
            <div className="kpis">
              <div><b>{user.orders.length}</b><span>{t("k_orders")}</span></div>
              <div><b>{open}</b><span>{t("k_open")}</span></div>
              <div><b>{user.msgs.length}</b><span>{t("k_msgs")}</span></div>
            </div>
            <h4 className="dsub">{t("d_orders")}</h4>
            <OrdersTable orders={user.orders} />
          </>
        )}
        {tab === "orders" && (
          <>
            <h3 className="dh">{t("d_orders")}</h3>
            <OrdersTable orders={user.orders} />
          </>
        )}
        {tab === "msgs" && (
          <>
            <h3 className="dh">{t("d_msgs")}</h3>
            <MsgsTable msgs={user.msgs} />
          </>
        )}
        {tab === "prof" && <Profile key={email ?? ""} />}
      </div>
    </div>
  );
}

export function Account() {
  const { t } = useLang();
  const { user } = useAuth();
  return (
    <>
      <PageHero eyebrow={t("acc_eb")} title={t("nav_account")} crumbs={[{ label: t("nav_account") }]} />
      <section style={{ background: "var(--cream)" }}>
        <div className="wrap">{user ? <Dashboard /> : <AuthForms />}</div>
      </section>
    </>
  );
}
