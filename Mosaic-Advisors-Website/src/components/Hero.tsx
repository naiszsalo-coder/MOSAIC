import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "../i18n";
import { SLIDES } from "../data/content";
import { HeroBg } from "./Art";
import { BtnIcon, Icon } from "./ui";

const INTERVAL = 6500;

export function Hero() {
  const { t, L } = useLang();
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = SLIDES.length;

  const go = useCallback((i: number) => setSlide(((i % n) + n) % n), [n]);

  // Autoplay; restarts whenever the slide changes (manual or automatic).
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => go(slide + 1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [slide, paused, go]);

  // Pause while the tab is hidden.
  useEffect(() => {
    const on = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  return (
    <section
      className="hero"
      id="hero"
      aria-roledescription="carousel"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(slide + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div id="slides">
        {SLIDES.map((s, i) => {
          const [eb, h, p] = L(s);
          const on = i === slide;
          return (
            <div key={i} className={`slide ${on ? "on" : ""}`} aria-hidden={!on} aria-roledescription="slide">
              <div className="bg">
                <HeroBg c={s.c} i={i} />
              </div>
              <div className="wrap">
                <div className="txt">
                  <span className="eyebrow">{eb}</span>
                  {i === 0 ? <h1>{h}</h1> : <h2 className="h1">{h}</h2>}
                  <p>{p}</p>
                  <div className="btns">
                    <a href="#contact" className="btn btn-gold" tabIndex={on ? 0 : -1}>
                      {t("contact_btn")} <BtnIcon />
                    </a>
                    <a href="#services" className="btn btn-line" tabIndex={on ? 0 : -1}>
                      {t("svc_btn")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <a
        className="scroll-down"
        href="#about-sec"
        aria-label="Scroll"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("about-sec")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <div className="hero-ctrl">
        <div className="wrap">
          <div className="dots">
            {SLIDES.map((_, i) => (
              <button key={i} type="button" className={i === slide ? "on" : ""} aria-label={`Slide ${i + 1}`} aria-current={i === slide} onClick={() => go(i)} />
            ))}
          </div>
          <div className="arrows">
            <button type="button" aria-label={t("prev")} onClick={() => go(slide - 1)}>
              <Icon name="i-left" />
            </button>
            <button type="button" aria-label={t("next")} onClick={() => go(slide + 1)}>
              <Icon name="i-right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
