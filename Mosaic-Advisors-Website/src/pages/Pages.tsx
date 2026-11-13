import { useState } from "react";
import { useLang } from "../i18n";
import { FAQ, POSTS, SERVICES, STEPS, TEAM } from "../data/content";
import { ContactBlock } from "../components/ContactSection";
import { MapArt } from "../components/Art";
import { PostCard } from "../components/Sections";
import { Icon, PageHero, Reveal, SectionHead } from "../components/ui";
import { MVV } from "./Home";

/* ---------------- About ---------------- */
export function About() {
  const { t, lang } = useLang();
  const cols = ["#0f2238", "#16304d", "#1d3d61", "#0c1d30"];
  return (
    <>
      <PageHero eyebrow={t("about_eb")} title={t("nav_about")} crumbs={[{ label: t("nav_about") }]} />
      <section>
        <div className="wrap about-grid">
          <Reveal>
            <span className="eyebrow">{t("story_eb")}</span>
            <h2 style={{ margin: "12px 0 18px" }}>{t("about_h")}</h2>
            <p className="lead" style={{ marginBottom: 16 }}>{t("about_p")}</p>
            <p className="lead">{t("story_p")}</p>
          </Reveal>
          <Reveal className="mvv mvv-col">
            <MVV />
          </Reveal>
        </div>
      </section>
      <section style={{ background: "var(--cream)" }}>
        <div className="wrap">
          <SectionHead center eyebrow={t("how_eb")} title={t("how_h")} />
          <div className="steps">
            {STEPS[lang].map(([h, p]) => (
              <Reveal key={h}>
                <h4>{h}</h4>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <SectionHead center eyebrow={t("team_eb")} title={t("team_h")} />
          <div className="team">
            {TEAM[lang].map(([n, r], i) => (
              <Reveal key={n} className="mem">
                <div className="av" style={{ background: cols[i % cols.length] }} aria-hidden="true">
                  {n.charAt(0)}
                </div>
                <h4>{n}</h4>
                <span>{r}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- Services ---------------- */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal className={`qa ${open ? "open" : ""}`}>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
        {q}
        <i aria-hidden="true" />
      </button>
      <div className="ans" hidden={!open}>
        <p>{a}</p>
      </div>
    </Reveal>
  );
}

export function Services() {
  const { t, L, lang } = useLang();
  return (
    <>
      <PageHero eyebrow={t("svc_eb")} title={t("nav_services")} crumbs={[{ label: t("nav_services") }]} />
      <section style={{ paddingTop: 40 }}>
        <div className="wrap">
          {SERVICES.map((s) => {
            const d = L(s);
            return (
              <div className="svc-block" id={`svc-${s.id}`} key={s.id}>
                <Reveal className="side">
                  <div className="ic">
                    <Icon name={s.ic} />
                  </div>
                  <h3>{d.t}</h3>
                  <p>{d.d}</p>
                  <a href="#contact" className="btn btn-navy">{t("contact_btn")}</a>
                </Reveal>
                <Reveal className="svc-items">
                  {d.items.map(([h, p]) => (
                    <div key={h}>
                      <h4>{h}</h4>
                      <p>{p}</p>
                    </div>
                  ))}
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>
      <section style={{ background: "var(--cream)" }}>
        <div className="wrap">
          <SectionHead center eyebrow="FAQ" title={t("faq_h")} />
          <div className="faq">
            {FAQ[lang].map(([q, a]) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- Contact ---------------- */
export function Contact() {
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t("ct_eb")} title={t("nav_contact")} crumbs={[{ label: t("nav_contact") }]} />
      <section className="contact">
        <div className="wrap">
          <ContactBlock />
          <div className="map">
            <MapArt />
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- Blog ---------------- */
export function Blog() {
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow={t("blog_eb")} title={t("blog_h")} crumbs={[{ label: t("blog_eb") }]} />
      <section>
        <div className="wrap">
          <div className="posts">
            {POSTS.map((p, i) => (
              <PostCard key={p.id} p={p} i={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function PostPage({ id }: { id: string }) {
  const { t, L, fmtDate } = useLang();
  const p = POSTS.find((x) => x.id === id);
  if (!p) return <NotFound />;
  const d = L(p);
  return (
    <>
      <PageHero eyebrow={d.cat} title={d.t} crumbs={[{ label: t("blog_eb"), href: "#blog" }]} />
      <section>
        <div className="wrap">
          <article className="article">
            <div className="meta">
              <span>{fmtDate(p.date)}</span>
              <span>{p.mins} {t("min")}</span>
              <span>Mosaic Advisors</span>
            </div>
            {d.body.map((b, i) => {
              if (b[0] === "ul")
                return (
                  <ul key={i}>
                    {b[1].map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                );
              if (b[0] === "h") return <h2 key={i}>{b[1]}</h2>;
              if (b[0] === "n") return <div key={i} className="note">{b[1]}</div>;
              return <p key={i}>{b[1]}</p>;
            })}
            <div className="article-nav">
              <a href="#blog" className="btn btn-ghost">← {t("back")}</a>
              <a href="#contact" className="btn btn-gold">{t("contact_btn")}</a>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

/* ---------------- 404 ---------------- */
export function NotFound() {
  const { t } = useLang();
  return (
    <>
      <PageHero eyebrow="404" title={t("nf_h")} crumbs={[{ label: "404" }]} />
      <section>
        <div className="wrap center">
          <p className="lead" style={{ marginBottom: 28 }}>{t("nf_p")}</p>
          <a href="#home" className="btn btn-navy">{t("back_home")}</a>
        </div>
      </section>
    </>
  );
}
