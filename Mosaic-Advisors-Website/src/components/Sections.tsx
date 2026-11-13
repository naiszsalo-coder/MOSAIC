import { useLang } from "../i18n";
import { useUI } from "../context/UIContext";
import { PACKAGES, SERVICES, type Post, type Service } from "../data/content";
import { PostThumb } from "./Art";
import { BtnIcon, Icon, Reveal } from "./ui";

export function ServiceCard({ s }: { s: Service }) {
  const { t, L } = useLang();
  const d = L(s);
  return (
    <Reveal className="card">
      <div className="ic">
        <Icon name={s.ic} />
      </div>
      <h3>{d.t}</h3>
      <p className="card-d">{d.d}</p>
      <ul>
        {d.li.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <a className="more" href={`#services-${s.id}`}>
        {t("more")} <Icon name="i-arrow" />
      </a>
    </Reveal>
  );
}

export function ServiceCards() {
  return (
    <div className="cards">
      {SERVICES.map((s) => (
        <ServiceCard key={s.id} s={s} />
      ))}
    </div>
  );
}

export function PackageGrid() {
  const { t, L, lang } = useLang();
  const { openOrder } = useUI();
  return (
    <div className="pk-grid">
      {PACKAGES.map((p) => {
        const d = L(p);
        const price = lang === "en" ? `${t("from")} ₾${p.price}` : `₾${p.price}-${t("from")}`;
        return (
          <Reveal key={p.id} className={`pk ${p.feat ? "feat" : ""}`}>
            {p.feat && <span className="pop">{t("popular")}</span>}
            <span className="tag">{d.tag}</span>
            <h3>„{d.n}“</h3>
            <div className="price">
              {price} <small>{p.per === "mo" ? t("per_mo") : t("once")}</small>
            </div>
            <p className="desc">{d.d}</p>
            <ul>
              {d.li.map((x) => (
                <li key={x}>
                  <Icon name="i-check" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <button type="button" className={`btn ${p.feat ? "btn-gold" : "btn-navy"}`} onClick={() => openOrder(p.id)}>
              {t("order")}
            </button>
          </Reveal>
        );
      })}
    </div>
  );
}

export function PostCard({ p, i }: { p: Post; i: number }) {
  const { t, L, fmtDate } = useLang();
  const d = L(p);
  return (
    <Reveal as="a" className="post" href={`#post-${p.id}`}>
      <div className="th">
        <PostThumb p={p} i={i} />
        <span className="cat">{d.cat}</span>
      </div>
      <div className="bd">
        <div className="meta">
          <span>{fmtDate(p.date)}</span>
          <span>
            {p.mins} {t("min")}
          </span>
        </div>
        <h3>{d.t}</h3>
        <p>{d.ex}</p>
        <span className="more">
          {t("read")} <BtnIcon />
        </span>
      </div>
    </Reveal>
  );
}
