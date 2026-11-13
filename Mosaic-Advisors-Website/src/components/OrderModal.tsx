import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useLang } from "../i18n";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { PACKAGES, type PackageId } from "../data/content";
import { focusFirstError, validate, type Errors } from "../lib/validation";
import { Field, Icon } from "./ui";

type F = { pkg: PackageId; name: string; email: string; phone: string; note: string };
type K = keyof F;

function OrderForm({ initial, onDone }: { initial: PackageId; onDone: () => void }) {
  const { t, L } = useLang();
  const { user, email, addOrder } = useAuth();
  const { showToast } = useUI();
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [f, setF] = useState<F>({ pkg: initial, name: user?.name ?? "", email: email ?? "", phone: user?.phone ?? "", note: user?.company ?? "" });
  const [err, setErr] = useState<Errors<K>>({});

  useEffect(() => {
    // Focus the first empty field — but not on touch devices, where it would pop the keyboard over the sheet.
    if (!window.matchMedia("(hover: hover)").matches) return;
    const t0 = window.setTimeout(() => formRef.current?.querySelector<HTMLInputElement>("input[value='']")?.focus(), 250);
    return () => window.clearTimeout(t0);
  }, []);

  const set = <k extends K>(k: k, v: F[k]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (err[k]) setErr((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errors = validate<K>(f, { name: "req", email: "email", phone: "phone" });
    setErr(errors);
    if (Object.keys(errors).length) {
      focusFirstError(formRef.current);
      return;
    }
    addOrder({ pkg: f.pkg, name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), note: f.note.trim() });
    showToast(t("order_ok"));
    onDone();
  };

  return (
    <form noValidate onSubmit={submit} ref={formRef}>
      <Field id={`${id}k`} label={t("nav_packages")}>
        <select id={`${id}k`} value={f.pkg} onChange={(e) => set("pkg", e.target.value as PackageId)}>
          {PACKAGES.map((p) => (
            <option key={p.id} value={p.id}>
              „{L(p).n}“ — ₾{p.price} {p.per === "mo" ? t("per_mo") : t("once")}
            </option>
          ))}
        </select>
      </Field>
      <Field id={`${id}n`} label={`${t("f_name")} *`} error={err.name}>
        <input id={`${id}n`} autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!err.name} />
      </Field>
      <div className="row">
        <Field id={`${id}e`} label={`${t("f_email")} *`} error={err.email}>
          <input id={`${id}e`} type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!err.email} />
        </Field>
        <Field id={`${id}p`} label={`${t("f_phone")} *`} error={err.phone}>
          <input id={`${id}p`} type="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!err.phone} />
        </Field>
      </div>
      <Field id={`${id}c`} label={t("f_company")}>
        <input id={`${id}c`} autoComplete="organization" value={f.note} onChange={(e) => set("note", e.target.value)} />
      </Field>
      <button type="submit" className="btn btn-gold btn-block">
        {t("order")}
      </button>
    </form>
  );
}

export function OrderModal() {
  const { t } = useLang();
  const { orderPkg, closeOrder } = useUI();
  const [shown, setShown] = useState<PackageId | null>(null);
  const [key, setKey] = useState(0);

  // Keep the last package while the close animation runs; remount the form on every open.
  useEffect(() => {
    if (orderPkg) {
      setShown(orderPkg);
      setKey((k) => k + 1);
    }
  }, [orderPkg]);

  const open = orderPkg !== null;
  return (
    <div className={`modal ${open ? "on" : ""}`} aria-hidden={!open} onClick={(e) => e.target === e.currentTarget && closeOrder()}>
      <div className="box" role="dialog" aria-modal="true" aria-labelledby="order-h">
        <button type="button" className="close" aria-label={t("close")} onClick={closeOrder}>
          <Icon name="i-x" />
        </button>
        <h3 id="order-h">{t("order_h")}</h3>
        <p className="sub">{t("order_sub")}</p>
        {shown && <OrderForm key={key} initial={shown} onDone={closeOrder} />}
      </div>
    </div>
  );
}
