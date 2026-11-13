import { useLang } from "../i18n";
import { POSTS } from "../data/content";
import { Hero } from "../components/Hero";
import { AboutArt } from "../components/Art";
import { ContactBlock } from "../components/ContactSection";
import { PackageGrid, PostCard, ServiceCards } from "../components/Sections";
import { BtnIcon, Counter, Reveal, SectionHead } from "../components/ui";

export function MVV() {
  const { t } = useLang();
  return (
    <>
      {(["mission", "vision", "values"] as const).map((k) => (
        <div key={k}>
          <h4>
            <i />
            <span>{t(k)}</span>
          </h4>
          <p>{t(`${k}_p`)}</p>
        </div>
      ))}
    </>
  );
}

export function Home() {
  const { t } = useLang();
  return (
    <>
      <Hero />

      <section className="about" id="about-sec">
        <div className="wrap about-grid">
          <Reveal className="about-art">
            <AboutArt />
            <div className="badge">
              <b>12+</b>
              <span>{t("yrs")}</span>
            </div>
          </Reveal>
          <Reveal>
            <span className="eyebrow">{t("about_eb")}</span>
            <h2>{t("about_h")}</h2>
            <p className="body">{t("about_p")}</p>
            <div className="mvv">
              <MVV />
            </div>
            <a href="#about" className="btn btn-navy">
              {t("learn")} <BtnIcon />
            </a>
          </Reveal>
        </div>
      </section>

      <div className="stats">
        <div className="wrap">
          <div><Counter end={12} /><span>{t("st1")}</span></div>
          <div><Counter end={240} suffix="+" /><span>{t("st2")}</span></div>
          <div><Counter end={1800} suffix="+" /><span>{t("st3")}</span></div>
          <div><Counter end={98} suffix="%" /><span>{t("st4")}</span></div>
        </div>
      </div>

      <section className="services">
        <div className="wrap">
          <SectionHead eyebrow={t("svc_eb")} title={t("svc_h")}>
            <p className="lead" style={{ maxWidth: 460 }}>{t("svc_p")}</p>
          </SectionHead>
          <ServiceCards />
        </div>
      </section>

      <section id="packages-sec">
        <div className="wrap">
          <SectionHead center eyebrow={t("pk_eb")} title={t("pk_h")}>
            <p className="lead">{t("pk_p")}</p>
          </SectionHead>
          <PackageGrid />
        </div>
      </section>

      <section className="contact" id="contact-sec">
        <div className="wrap">
          <Reveal>
            <ContactBlock />
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead eyebrow={t("blog_eb")} title={t("blog_h")}>
            <a href="#blog" className="btn btn-ghost">
              {t("all_posts")} <BtnIcon />
            </a>
          </SectionHead>
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
