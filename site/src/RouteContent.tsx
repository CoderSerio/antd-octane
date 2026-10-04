import { useEffect, useState } from "octane";

type PageComponent = (props: {
  section?: string;
}) => import("octane").OctaneNode;

function isStaleDynamicImport(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /(?:failed to fetch dynamically imported module|importing a module script failed|chunkloaderror|loading chunk)/i.test(
    message,
  );
}

const pages: Record<string, () => Promise<{ default: PageComponent }>> = {
  tailwindcss: () => import("./pages/tailwindcss"),
  "for-agents": () => import("./pages/for-agents"),
  contributing: () => import("./pages/contributing"),
  changelog: () => import("./pages/changelog"),
  home: () => import("./pages/home"),
  tour: () => import("./pages/tour"),
  affix: () => import("./pages/affix"),
  anchor: () => import("./pages/anchor"),
  "float-button": () => import("./pages/float-button"),
  image: () => import("./pages/image"),
  calendar: () => import("./pages/calendar"),
  table: () => import("./pages/table"),
  tree: () => import("./pages/tree"),
  carousel: () => import("./pages/carousel"),
  splitter: () => import("./pages/splitter"),
  watermark: () => import("./pages/watermark"),
  app: () => import("./pages/app"),
  "config-provider": () => import("./pages/config-provider"),
  util: () => import("./pages/util"),
  icon: () => import("./pages/icon"),

  message: () => import("./pages/message"),
  notification: () => import("./pages/notification"),
  modal: () => import("./pages/modal"),
  drawer: () => import("./pages/drawer"),
  menu: () => import("./pages/menu"),
  dropdown: () => import("./pages/dropdown"),
  popconfirm: () => import("./pages/popconfirm"),

  "qr-code": () => import("./pages/qr-code"),
  "input-number": () => import("./pages/input-number"),
  "auto-complete": () => import("./pages/auto-complete"),
  form: () => import("./pages/form"),
  select: () => import("./pages/select"),
  slider: () => import("./pages/slider"),
  typography: () => import("./pages/typography"),
  list: () => import("./pages/list"),
  spin: () => import("./pages/spin"),
  skeleton: () => import("./pages/skeleton"),
  progress: () => import("./pages/progress"),
  result: () => import("./pages/result"),
  segmented: () => import("./pages/segmented"),
  rate: () => import("./pages/rate"),
  breadcrumb: () => import("./pages/breadcrumb"),
  pagination: () => import("./pages/pagination"),
  steps: () => import("./pages/steps"),
  tooltip: () => import("./pages/tooltip"),
  popover: () => import("./pages/popover"),
  button: () => import("./pages/button"),
  grid: () => import("./pages/grid"),
  layout: () => import("./pages/layout"),
  collapse: () => import("./pages/collapse"),
  tabs: () => import("./pages/tabs"),
  empty: () => import("./pages/empty"),
  statistic: () => import("./pages/statistic"),
  timeline: () => import("./pages/timeline"),
  descriptions: () => import("./pages/descriptions"),
  radio: () => import("./pages/radio"),
  tag: () => import("./pages/tag"),
  alert: () => import("./pages/alert"),
  card: () => import("./pages/card"),
  badge: () => import("./pages/badge"),
  avatar: () => import("./pages/avatar"),
  flex: () => import("./pages/flex"),
  space: () => import("./pages/space"),
  divider: () => import("./pages/divider"),
  switch: () => import("./pages/switch"),
  input: () => import("./pages/input"),
  checkbox: () => import("./pages/checkbox"),
  overview: () => import("./pages/overview"),
  start: () => import("./pages/start"),
  theme: () => import("./pages/theme"),
  components: () => import("./pages/components"),
  "api-conventions": () => import("./pages/api-conventions"),
  compatibility: () => import("./pages/compatibility"),
};
export function RouteContent({
  page,
  section,
}: {
  page: string;
  section?: string;
}) {
  const [loaded, setLoaded] = useState<{
    id: string;
    Page: PageComponent;
  } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setFailed(false);
    const load = Object.hasOwn(pages, page) ? pages[page] : undefined;
    if (load)
      void load()
        .then((module) => {
          if (active) setLoaded({ id: page, Page: module.default });
        })
        .catch((error) => {
          if (!active) return;
          if (isStaleDynamicImport(error)) {
            const reloadKey = `ao-route-reload:${page}`;
            if (sessionStorage.getItem(reloadKey) !== window.location.href) {
              sessionStorage.setItem(reloadKey, window.location.href);
              window.location.reload();
              return;
            }
          }
          setFailed(true);
        });
    return () => {
      active = false;
    };
  }, [page]);
  const Page = loaded?.id === page ? loaded.Page : null;
  if (!Object.hasOwn(pages, page))
    return (
      <>
        <h1>页面不存在</h1>
        <a href="#overview">返回项目介绍</a>
      </>
    );
  if (failed)
    return (
      <div className="notice" role="alert">
        文档加载失败，可能是本地重新构建后浏览器仍在使用旧的动态资源。
        <button type="button" onClick={() => window.location.reload()}>
          刷新页面
        </button>
      </div>
    );
  return Page ? (
    <Page section={section} />
  ) : (
    <p className="page-loading" role="status">
      正在加载文档…
    </p>
  );
}
