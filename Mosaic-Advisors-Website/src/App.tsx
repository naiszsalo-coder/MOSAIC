import { useEffect } from "react";
import { LangProvider, useLang } from "./i18n";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { useRoute, type Route } from "./lib/router";
import { Sprite } from "./components/Sprite";
import { BackToTop, Footer, Header, Toast, Topbar } from "./components/Layout";
import { OrderModal } from "./components/OrderModal";
import { ChatWidget } from "./components/ChatWidget";
import { Home } from "./pages/Home";
import { About, Blog, Contact, NotFound, PostPage, Services } from "./pages/Pages";
import { Account } from "./pages/Account";

function Page({ route }: { route: Route }) {
  switch (route.view) {
    case "home":
      return <Home />;
    case "about":
      return <About />;
    case "services":
      return <Services />;
    case "contact":
      return <Contact />;
    case "blog":
      return <Blog />;
    case "post":
      return <PostPage id={route.param ?? ""} />;
    case "account":
      return <Account />;
    default:
      return <NotFound />;
  }
}

/** After each navigation: scroll to the requested section, or to the top of the new page. */
function useScrollOnRoute(route: Route) {
  useEffect(() => {
    let target: string | null = null;
    if (route.view === "home" && route.param === "packages") target = "packages-sec";
    if (route.view === "services" && route.param) target = `svc-${route.param}`;
    const raf = requestAnimationFrame(() => {
      const el = target ? document.getElementById(target) : null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(raf);
  }, [route]);
}

function useDocumentTitle(route: Route) {
  const { t, lang } = useLang();
  useEffect(() => {
    const map: Partial<Record<Route["view"], string>> = {
      about: t("nav_about"),
      services: t("nav_services"),
      contact: t("nav_contact"),
      blog: t("blog_eb"),
      account: t("nav_account"),
      notfound: "404"
    };
    const part = map[route.view];
    document.title = part ? `${part} — Mosaic Advisors` : "Mosaic Advisors — Accounting, Legal & Audit";
  }, [route, t, lang]);
}

function Shell() {
  const route = useRoute();
  const { t } = useLang();
  useScrollOnRoute(route);
  useDocumentTitle(route);
  return (
    <>
      <a className="skip" href="#main" onClick={(e) => {
        e.preventDefault();
        document.getElementById("main")?.focus();
      }}>
        {t("skip")}
      </a>
      <Sprite />
      <Topbar />
      <Header route={route} />
      <main id="main" tabIndex={-1}>
        {/* key remounts the page on navigation so reveal animations and local state reset */}
        <Page key={route.view + (route.view === "post" ? route.param : "")} route={route} />
      </main>
      <Footer />
      <ChatWidget />
      <BackToTop />
      <OrderModal />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <UIProvider>
          <Shell />
        </UIProvider>
      </AuthProvider>
    </LangProvider>
  );
}
