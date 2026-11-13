import { useEffect, useRef, useState, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { useLang, type TKey } from "../i18n";

/* ---------- Icon (uses the sprite) ---------- */
export type IconId =
  | "i-pin" | "i-phone" | "i-mail" | "i-clock" | "i-arrow" | "i-left" | "i-right" | "i-check" | "i-x" | "i-chat"
  | "i-send" | "i-up" | "i-calc" | "i-legal" | "i-chart" | "i-fb" | "i-in" | "i-yt" | "i-ig" | "logo";

export function Icon({ name, className, size }: { name: IconId; className?: string; size?: number }) {
  const s = size ? { width: size, height: size } : undefined;
  return (
    <svg className={className} style={s} aria-hidden="true" focusable="false">
      <use href={`#${name}`} />
    </svg>
  );
}

/** Small inline arrow used inside buttons. */
export function BtnIcon({ name = "i-arrow" }: { name?: IconId }) {
  return (
    <svg width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2" aria-hidden="true">
      <use href={`#${name}`} />
    </svg>
  );
}

export function Logo() {
  return (
    <a href="#home" className="logo" aria-label="Mosaic Advisors">
      <Icon name="logo" className="mark" />
      <div>
        <b>Mosaic</b>
        <small>Advisors</small>
      </div>
    </a>
  );
}

/* ---------- Reveal on scroll ---------- */
type RevealProps<T extends ElementType> = { as?: T; children?: ReactNode; className?: string } & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Reveal<T extends ElementType = "div">({ as, children, className = "", ...rest }: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

/* ---------- Animated counter ---------- */
export function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / 1600);
        setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) {
      setVal(end);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end]);
  return <b ref={ref}>{val.toLocaleString("en-US") + suffix}</b>;
}

/* ---------- Inner-page hero ---------- */
export function PageHero({ eyebrow, title, crumbs }: { eyebrow: string; title: string; crumbs: { label: string; href?: string }[] }) {
  const { t } = useLang();
  return (
    <div className="phero">
      <Icon name="logo" className="deco" />
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <nav className="crumbs" aria-label="breadcrumb">
          <a href="#home">{t("nav_home")}</a>
          {crumbs.map((c, i) => (
            <span key={i}>
              {" / "}
              {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ---------- Form field ---------- */
export function Field({ label, error, children, id }: { label: string; error?: TKey; children: ReactNode; id: string }) {
  const { t } = useLang();
  return (
    <div className={`fld ${error ? "bad" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      <div className="er" role={error ? "alert" : undefined}>
        {error ? t(error) : ""}
      </div>
    </div>
  );
}

export function SectionHead({ eyebrow, title, center, children }: { eyebrow: string; title: string; center?: boolean; children?: ReactNode }) {
  if (center)
    return (
      <Reveal className="center" style={{ marginBottom: 48 }}>
        <span className="eyebrow">{eyebrow}</span>
        <h2 style={{ marginTop: 12 }}>{title}</h2>
        {children}
      </Reveal>
    );
  return (
    <Reveal className="head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </Reveal>
  );
}
