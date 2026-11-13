import { useEffect, useState, type FormEvent } from "react";
import { useLang, type Lang, type TKey } from "../i18n";
import { useUI } from "../context/UIContext";
import { CONTACT, SERVICES } from "../data/content";
import { store } from "../lib/storage";
import { isEmail } from "../lib/validation";
import type { Route } from "../lib/router";
import { Icon, Logo } from "./ui";

function LangSwitch() {
  const { lang, setLang } = useLang();
  const opts: [Lang, string][] = [
    ["ka", "ქარ"],
    ["en", "ENG"]
  ];
  return (
    <div className="lang" role="group" aria-label="Language">
      {opts.map(([l, label]) => (
        <button key={l} type="button" className={lang === l ? "on" : ""} aria-pressed={lang === l} onClick={() => setLang(l)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Social({ items }: { items: ("fb" | "yt" | "in" | "ig")[] }) {
  const map = {
    fb: [CONTACT.social.facebook, "Facebook", "i-fb"],
    yt: [CONTACT.social.youtube, "YouTube", "i-yt"],
    in: [CONTACT.social.linkedin, "LinkedIn", "i-in"],
    ig: [CONTACT.social.instagram, "Instagram", "i-ig"]
  } as const;
  return (
    <div className="social">
      {items.map((k) => (
        <a key={k} href={map[k][0]} aria-label={map[k][1]} target="_blank" rel="noopener noreferrer">
          <Icon name={map[k][2]} />
        </a>
      ))}
    </div>
  );
}

export function Topbar() {
  const { t } = useLang();
  return (
    <div className="topbar">
      <div className="wrap">
        <div className="info">
          <span>
            <Icon name="i-pin" />
            <b>{t("addr")}</b>
          </span>
          <span>
            <Icon name="i-phone" />
            <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          </span>
          <span>
            <Icon name="i-mail" />
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </span>
        </div>
        <div className="right">
          <Social items={["fb", "yt", "in"]} />
          <LangSwitch />
        </div>
      </div>
    </div>
  );
}

const NAV: [string, TKey][] = [
  ["home", "nav_home"],
  ["about", "nav_about"],
  ["services", "nav_services"],
  ["packages", "nav_packages"],
  ["contact", "nav_contact"]
];

function activeKey(r: Route): string {
  if (r.raw === "packages") return "packages";
  if (r.view === "post") return "blog";
  return r.view;
}

export function Header({ route }: { route: Route }) {
  const { t } = useLang();
  const { drawerOpen, setDrawerOpen } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const active = activeKey(route);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => setDrawerOpen(false), [route.raw, setDrawerOpen]);

  const links = (drawer: boolean) => (
    <>
      {NAV.map(([h, k]) => (
        <a key={h} href={`#${h}`} className={active === h ? "active" : ""} aria-current={active === h ? "page" : undefined}>
          {t(k)}
        </a>
      ))}
      <a href="#account" className={`${drawer ? "" : "cab"} ${active === "account" ? "active" : ""}`.trim()}>
        ✦ {t("nav_account")}
      </a>
    </>
  );

  return (
    <>
      <header className={`main ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap">
          <Logo />
          <nav className="menu" aria-label="Main">
            {links(false)}
          </nav>
          <button className="burger" type="button" aria-label={t("menu")} aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>
            <span />
          </button>
        </div>
      </header>
      <div className={`drawer ${drawerOpen ? "on" : ""}`} aria-hidden={!drawerOpen}>
        <div className="ov" onClick={() => setDrawerOpen(false)} />
        <nav className="pn" aria-label="Mobile">
          <button type="button" className="drawer-x" aria-label={t("close")} onClick={() => setDrawerOpen(false)}>
            <Icon name="i-x" />
          </button>
          {links(true)}
          <LangSwitch />
        </nav>
      </div>
    </>
  );
}

export function Footer() {
  const { t, L } = useLang();
  const { showToast } = useUI();
  const [nl, setNl] = useState("");
  const [bad, setBad] = useState(false);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(nl)) {
      setBad(true);
      return;
    }
    const list = store.get<string[]>("nl", []);
    store.set("nl", Array.from(new Set([...(Array.isArray(list) ? list : []), nl.trim().toLowerCase()])));
    setNl("");
    setBad(false);
    showToast(t("nl_ok"));
  };

  return (
    <footer>
      <div className="wrap f-grid">
        <div>
          <Logo />
          <p>{t("f_about")}</p>
          <Social items={["fb", "ig", "in"]} />
        </div>
        <div>
          <h5>{t("f_nav")}</h5>
          <ul>
            <li><a href="#about">{t("nav_about")}</a></li>
            <li><a href="#services">{t("nav_services")}</a></li>
            <li><a href="#blog">{t("blog_eb")}</a></li>
            <li><a href="#contact">{t("nav_contact")}</a></li>
            <li><a href="#account">{t("nav_account")}</a></li>
          </ul>
        </div>
        <div>
          <h5>{t("nav_services")}</h5>
          <ul>
            {SERVICES.map((s) => (
              <li key={s.id}>
                <a href={`#services-${s.id}`}>{L(s).t}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5>{t("f_ct")}</h5>
          <ul>
            <li>{t("addr_full")}</li>
            <li><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
            <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            <li>{t("hours")}</li>
          </ul>
          <form className={`nl ${bad ? "bad" : ""}`} onSubmit={subscribe} noValidate>
            <input
              type="email"
              value={nl}
              aria-label={t("nl_ph")}
              aria-invalid={bad}
              placeholder={t("nl_ph")}
              onChange={(e) => {
                setNl(e.target.value);
                setBad(false);
              }}
            />
            <button type="submit">{t("nl_btn")}</button>
          </form>
          {bad && <div className="nl-er">{t("e_email")}</div>}
        </div>
      </div>
      <div className="f-bot">
        <div className="wrap">
          <span>
            © {new Date().getFullYear()} Mosaic Advisors. {t("rights")}
          </span>
          <span>{t("demo_site")}</span>
        </div>
      </div>
    </footer>
  );
}

export function Toast() {
  const { toast } = useUI();
  return (
    <div className={`toast ${toast ? "on" : ""}`} role="status" aria-live="polite">
      <i />
      <span>{toast}</span>
    </div>
  );
}

export function BackToTop() {
  const { t } = useLang();
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(window.scrollY > 600);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <button type="button" className={`totop ${on ? "on" : ""}`} aria-label={t("to_top")} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <Icon name="i-up" />
    </button>
  );
}
