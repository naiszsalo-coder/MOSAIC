import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLang, type TKey } from "../i18n";
import { useUI } from "../context/UIContext";
import { store } from "../lib/storage";
import { Icon } from "./ui";

/** A message is either free text (from the visitor) or an i18n key (from the advisor), so replies re-translate on language switch. */
type Msg = { id: string; who: "me" | "them"; text?: string; key?: TKey; d: number };

const QUICK: TKey[] = ["q1", "q2", "q3", "q4"];

/** Keyword router for auto-replies. Order matters: first match wins. */
export function pickReply(text: string): TKey {
  const s = text.toLowerCase();
  if (/@|\+?\d[\d\s-]{7,}/.test(s)) return "r_contact";
  if (/scan|სკან|უფასო|free|ზარ|call/.test(s)) return "r_scan";
  if (/pric|cost|ფას|ღირ|პაკეტ|package|₾|lari/.test(s)) return "r_price";
  if (/regist|რეგისტ|company|კომპან|შპს|llc/.test(s)) return "r_reg";
  if (/vat|დღგ|tax|გადასახ/.test(s)) return "r_vat";
  return "r_def";
}

function loadLog(): Msg[] {
  const raw = store.get<unknown>("chat", []);
  if (!Array.isArray(raw)) return [];
  return raw.filter((m): m is Msg => !!m && typeof m === "object" && ((m as Msg).who === "me" || (m as Msg).who === "them") && typeof (m as Msg).d === "number").map((m, i) => ({ ...m, id: m.id ?? `m${i}` }));
}

export function ChatWidget() {
  const { t, fmtTime } = useLang();
  const { chatOpen, setChatOpen } = useUI();
  const [log, setLog] = useState<Msg[]>(() => {
    const l = loadLog();
    return l.length ? l : [{ id: "hi", who: "them", key: "chat_hi", d: Date.now() }];
  });
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [seen, setSeen] = useState(() => loadLog().length > 1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => store.set("chat", log), [log]);
  useEffect(() => () => timers.current.forEach((x) => window.clearTimeout(x)), []);

  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [log, typing, chatOpen]);

  useEffect(() => {
    if (!chatOpen) return;
    setSeen(true);
    if (window.matchMedia("(hover: hover)").matches) {
      const x = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(x);
    }
  }, [chatOpen]);

  const send = (text: string) => {
    const v = text.trim();
    if (!v) return;
    const now = Date.now();
    setLog((l) => [...l, { id: `u${now}`, who: "me", text: v, d: now }]);
    setInput("");
    setTyping(true);
    timers.current.push(
      window.setTimeout(() => {
        setTyping(false);
        setLog((l) => [...l, { id: `a${Date.now()}`, who: "them", key: pickReply(v), d: Date.now() }]);
      }, 900 + Math.random() * 700)
    );
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      <button type="button" className="chat-fab" aria-label={chatOpen ? t("close") : t("chat_name")} aria-expanded={chatOpen} onClick={() => setChatOpen(!chatOpen)}>
        <Icon name="i-chat" />
        {!seen && <span className="ping">1</span>}
      </button>
      <div className={`chat ${chatOpen ? "on" : ""}`} role="dialog" aria-label={t("chat_name")} aria-hidden={!chatOpen}>
        <div className="chat-h">
          <div className="av">{t("chat_name").charAt(0)}</div>
          <div>
            <b>{t("chat_name")}</b>
            <small>{t("chat_role")}</small>
          </div>
          <button type="button" className="x" aria-label={t("close")} onClick={() => setChatOpen(false)}>
            <Icon name="i-x" />
          </button>
        </div>
        <div className="chat-b" ref={bodyRef} aria-live="polite">
          {log.map((m) => (
            <div key={m.id} className={`msg ${m.who}`}>
              {m.key ? t(m.key) : m.text}
              <time>{fmtTime(m.d)}</time>
            </div>
          ))}
          {typing && (
            <div className="msg them typing" aria-label="…">
              <i />
              <i />
              <i />
            </div>
          )}
        </div>
        <div className="quick">
          {QUICK.map((k) => (
            <button key={k} type="button" onClick={() => send(t(k))} disabled={typing}>
              {t(k)}
            </button>
          ))}
        </div>
        <form className="chat-f" onSubmit={onSubmit}>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" placeholder={t("chat_ph")} aria-label={t("chat_ph")} maxLength={1000} />
          <button type="submit" aria-label={t("send")}>
            <Icon name="i-send" />
          </button>
        </form>
      </div>
    </>
  );
}
