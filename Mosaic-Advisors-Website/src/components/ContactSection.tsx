import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useLang } from "../i18n";
import { useAuth, type Dept } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { CONTACT } from "../data/content";
import { focusFirstError, validate, type Errors } from "../lib/validation";
import { Field, Icon } from "./ui";

type F = { name: string; email: string; phone: string; dept: "" | Dept; msg: string; agree: boolean };
type K = keyof F;

const DEPTS: Dept[] = ["support", "services", "finance", "problem"];

function ContactForm() {
  const { t } = useLang();
  const { user, email, addMessage } = useAuth();
  const { showToast } = useUI();
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const blank = (): F => ({ name: user?.name ?? "", email: email ?? "", phone: user?.phone ?? "", dept: "", msg: "", agree: false });
  const [f, setF] = useState<F>(blank);
  const [err, setErr] = useState<Errors<K>>({});
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const timers = useRef<number[]>([]);

  // Prefill when the visitor logs in / out.
  useEffect(() => {
    setF((p) => ({ ...p, name: user?.name ?? "", email: email ?? "", phone: user?.phone ?? "" }));
  }, [user?.name, user?.phone, email]);

  useEffect(() => () => timers.current.forEach((x) => window.clearTimeout(x)), []);

  const set = <k extends K>(k: k, v: F[k]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (err[k]) setErr((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const errors = validate<K>(f, { name: "req", email: "email", phone: "phoneopt", dept: "req", msg: "req", agree: "check" });
    setErr(errors);
    if (Object.keys(errors).length) {
      focusFirstError(formRef.current);
      return;
    }
    setBusy(true);
    // Simulated network latency — replace with a real API call in production.
    timers.current.push(
      window.setTimeout(() => {
        addMessage({ dept: f.dept as Dept, msg: f.msg.trim(), name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim() });
        setBusy(false);
        setOk(true);
        setF(blank());
        showToast(t("sent_ok"));
        timers.current.push(window.setTimeout(() => setOk(false), 6000));
      }, 600)
    );
  };

  return (
    <form className="cf" noValidate onSubmit={submit} ref={formRef}>
      <div className="row">
        <Field id={`${id}n`} label={`${t("f_name")} *`} error={err.name}>
          <input id={`${id}n`} name="name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!err.name} />
        </Field>
        <Field id={`${id}e`} label={`${t("f_email")} *`} error={err.email}>
          <input id={`${id}e`} name="email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!err.email} />
        </Field>
      </div>
      <div className="row">
        <Field id={`${id}p`} label={t("f_phone")} error={err.phone}>
          <input id={`${id}p`} name="phone" type="tel" autoComplete="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!err.phone} />
        </Field>
        <Field id={`${id}d`} label={`${t("f_dept")} *`} error={err.dept}>
          <select id={`${id}d`} name="dept" value={f.dept} onChange={(e) => set("dept", e.target.value as F["dept"])} aria-invalid={!!err.dept}>
            <option value="">{t("d_choose")}</option>
            {DEPTS.map((d) => (
              <option key={d} value={d}>
                {t(`d_${d}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id={`${id}m`} label={`${t("f_msg")} *`} error={err.msg}>
        <textarea id={`${id}m`} name="msg" value={f.msg} onChange={(e) => set("msg", e.target.value)} aria-invalid={!!err.msg} />
      </Field>
      <div className={`fld chk-wrap ${err.agree ? "bad" : ""}`}>
        <label className="chk">
          <input type="checkbox" name="agree" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} />
          <span>{t("f_agree")}</span>
        </label>
        <div className="er">{err.agree ? t(err.agree) : ""}</div>
      </div>
      <button className="btn btn-gold" type="submit" disabled={busy}>
        {t("send")} <Icon name="i-send" size={16} className="btn-ic" />
      </button>
      <div className={`form-ok ${ok ? "on" : ""}`} role="status">
        {t("sent_ok")}
      </div>
    </form>
  );
}

export function ContactBlock() {
  const { t } = useLang();
  const items = [
    ["i-pin", t("l_addr"), t("addr_full")],
    ["i-phone", t("l_phone"), CONTACT.phone],
    ["i-mail", t("l_mail"), CONTACT.email],
    ["i-clock", t("hours_label"), t("hours")]
  ] as const;
  return (
    <div className="ct-grid">
      <div className="ct-side">
        <span className="eyebrow">{t("ct_eb")}</span>
        <h2>{t("ct_h")}</h2>
        <p>{t("ct_p")}</p>
        {items.map(([ic, label, val]) => (
          <div className="ct-item" key={ic}>
            <div className="i">
              <Icon name={ic} />
            </div>
            <div>
              <small>{label}</small>
              <b>{val}</b>
            </div>
          </div>
        ))}
        <Icon name="logo" className="deco" />
      </div>
      <ContactForm />
    </div>
  );
}
