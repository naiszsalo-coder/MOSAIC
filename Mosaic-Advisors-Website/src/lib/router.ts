import { useEffect, useState } from "react";

/**
 * Hash router. Hash routes work everywhere — on any static host and when the
 * built index.html is opened straight from disk (file://) — with no server rewrites.
 *
 *   #home | (empty)        → home
 *   #packages              → home, scrolled to packages
 *   #about #contact #blog #account
 *   #services              → services
 *   #services-<id>         → services, scrolled to that service
 *   #post-<id>             → single blog post
 *   anything else          → 404
 */
export type View = "home" | "about" | "services" | "contact" | "blog" | "post" | "account" | "notfound";
export type Route = { view: View; param: string | null; raw: string };

const SIMPLE: View[] = ["home", "about", "services", "contact", "blog", "account"];

export function parseHash(hash: string): Route {
  const raw = decodeURIComponent(hash.replace(/^#/, ""));
  if (raw === "" || raw === "home") return { view: "home", param: null, raw };
  if (raw === "packages") return { view: "home", param: "packages", raw };
  if (raw.startsWith("post-")) return { view: "post", param: raw.slice(5), raw };
  if (raw.startsWith("services-")) return { view: "services", param: raw.slice(9), raw };
  if ((SIMPLE as string[]).includes(raw)) return { view: raw as View, param: null, raw };
  return { view: "notfound", param: null, raw };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

/** Navigate; if the hash is already current, re-dispatch so scroll targets still apply. */
export function go(hash: string) {
  const target = "#" + hash.replace(/^#/, "");
  if (window.location.hash === target) window.dispatchEvent(new HashChangeEvent("hashchange"));
  else window.location.hash = target;
}
