import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ka, type TKey } from "./ka";
import { en } from "./en";
import { store } from "../lib/storage";

export type Lang = "ka" | "en";
/** Any value that exists in both languages. */
export type Loc<T> = { ka: T; en: T };
export type { TKey };

const DICTS = { ka, en } as const;

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
  L: <T>(o: Loc<T>) => T;
  fmtDate: (iso: string) => string;
  fmtTime: (ms: number) => string;
};

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (store.get<string>("lang", "ka") === "en" ? "en" : "ka"));

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    store.set("lang", l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangCtx>(() => {
    const locale = lang === "ka" ? "ka-GE" : "en-GB";
    return {
      lang,
      setLang,
      t: (key) => DICTS[lang][key] ?? key,
      L: (o) => o[lang],
      fmtDate: (iso) => new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }),
      fmtTime: (ms) => new Date(ms).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    };
  }, [lang, setLang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLang must be used inside <LangProvider>");
  return c;
}
