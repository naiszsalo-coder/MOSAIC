// დეკორატიული SVG ილუსტრაციები (გარე სურათები არ გამოიყენება).
import type { Post } from "../data/content";

const tiles = <rect width="100%" height="100%" fill="url(#tiles)" />;

export function HeroBg({ c, i }: { c: [string, string]; i: number }) {
  const id = `hg${i}`;
  return (
    <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 1600 800" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c[0]} />
          <stop offset="1" stopColor={c[1]} />
        </linearGradient>
      </defs>
      <rect width="1600" height="800" fill={`url(#${id})`} />
      {tiles}
      {i === 0 && (
        <g opacity=".5">
          <rect x="62%" y="12%" width="180" height="180" rx="14" fill="#c49a52" opacity=".18" />
          <rect x="74%" y="40%" width="260" height="260" rx="18" fill="#fff" opacity=".04" />
          <rect x="66%" y="58%" width="120" height="120" rx="12" fill="#c49a52" opacity=".28" />
        </g>
      )}
      {i === 1 && (
        <g opacity=".5">
          <circle cx="78%" cy="38%" r="190" fill="#c49a52" opacity=".12" />
          <rect x="70%" y="52%" width="220" height="140" rx="14" fill="#fff" opacity=".05" />
          <path d="M1200 120h260v20h-260zM1200 170h200v20h-200z" fill="#c49a52" opacity=".3" />
        </g>
      )}
      {i === 2 && (
        <g opacity=".55">
          <path d="M900 600 L1050 450 L1180 520 L1400 260" stroke="#c49a52" strokeWidth="6" fill="none" opacity=".5" />
          <rect x="68%" y="20%" width="140" height="140" rx="12" fill="#fff" opacity=".05" />
          <rect x="82%" y="62%" width="180" height="180" rx="14" fill="#c49a52" opacity=".16" />
        </g>
      )}
    </svg>
  );
}

export function AboutArt() {
  return (
    <svg viewBox="0 0 400 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="440" fill="#f7f4ee" />
      <g opacity=".95">
        <rect x="40" y="50" width="150" height="150" rx="10" fill="#0f2238" />
        <rect x="205" y="50" width="150" height="70" rx="10" fill="#c49a52" />
        <rect x="205" y="130" width="70" height="70" rx="10" fill="#e2c38b" />
        <rect x="285" y="130" width="70" height="70" rx="10" fill="#16304d" />
        <rect x="40" y="215" width="70" height="150" rx="10" fill="#c49a52" />
        <rect x="120" y="215" width="235" height="150" rx="10" fill="#0f2238" />
      </g>
      <g stroke="#c49a52" strokeWidth="3" fill="none">
        <path d="M150 320l45-45 35 30 70-70" />
        <circle cx="300" cy="235" r="6" fill="#c49a52" />
      </g>
      <g fill="#fff" opacity=".9">
        <rect x="70" y="95" width="90" height="8" rx="4" />
        <rect x="70" y="113" width="60" height="8" rx="4" />
        <rect x="70" y="131" width="75" height="8" rx="4" />
      </g>
    </svg>
  );
}

export function PostThumb({ p, i }: { p: Post; i: number }) {
  const [a, b] = p.c;
  const v = i % 3;
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="250" fill={a} />
      {tiles}
      {v === 0 && (
        <>
          <rect x="230" y="40" width="120" height="160" rx="8" fill="#fff" opacity=".9" />
          <rect x="250" y="70" width="80" height="6" rx="3" fill={a} opacity=".5" />
          <rect x="250" y="88" width="60" height="6" rx="3" fill={a} opacity=".5" />
          <rect x="250" y="106" width="70" height="6" rx="3" fill={a} opacity=".5" />
          <rect x="210" y="60" width="120" height="160" rx="8" fill={b} opacity=".5" />
        </>
      )}
      {v === 1 && (
        <>
          <circle cx="290" cy="125" r="70" fill={b} opacity=".85" />
          <text x="290" y="140" textAnchor="middle" fontFamily="Playfair Display,serif" fontSize="46" fontWeight="700" fill={a}>
            18%
          </text>
        </>
      )}
      {v === 2 && (
        <>
          <path d="M190 200 L240 150 L280 170 L350 80" stroke={b} strokeWidth="6" fill="none" />
          <circle cx="350" cy="80" r="9" fill={b} />
          <rect x="190" y="205" width="170" height="3" fill="#fff" opacity=".3" />
        </>
      )}
    </svg>
  );
}

export function MapArt() {
  return (
    <svg viewBox="0 0 1200 340" style={{ width: "100%", height: "auto", background: "#e9edf2", display: "block" }} role="img" aria-label="Map: Rustaveli Ave., Tbilisi">
      <rect width="1200" height="340" fill="#e9edf2" />
      <path d="M0 210 C200 170 380 260 560 200 S900 120 1200 170 L1200 220 C900 170 760 260 560 250 S200 220 0 260Z" fill="#b9d3e6" />
      <g stroke="#fff" strokeWidth="10" fill="none">
        <path d="M0 90H1200M300 0V340M720 0V340M0 300 L1200 40" />
      </g>
      <g stroke="#fff" strokeWidth="4" fill="none" opacity=".8">
        <path d="M0 150H1200M150 0V340M520 0V340M930 0V340" />
      </g>
      <circle cx="600" cy="150" r="52" fill="#c49a52" opacity=".2" />
      <path d="M600 165s28-24 28-46a28 28 0 1 0-56 0c0 22 28 46 28 46z" fill="#0f2238" />
      <circle cx="600" cy="119" r="10" fill="#c49a52" />
      <rect x="640" y="96" width="210" height="50" rx="10" fill="#fff" />
      <text x="658" y="118" fontFamily="Inter" fontWeight="700" fontSize="15" fill="#0f2238">
        Mosaic Advisors
      </text>
      <text x="658" y="136" fontFamily="Inter" fontSize="12" fill="#5b6675">
        Rustaveli Ave., Tbilisi
      </text>
    </svg>
  );
}
