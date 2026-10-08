import { Button, Result } from "antd-octane";
import { useEffect, useState } from "octane";
import { Loading } from "./Loading";

type PageComponent = (props: {
  section?: string;
}) => import("octane").OctaneNode;
const pages: Record<string, () => Promise<{ default: PageComponent }>> = {
  cascader: () => import("./pages/cascader"),
  "color-picker": () => import("./pages/color-picker"),
  mentions: () => import("./pages/mentions"),
  "time-picker": () => import("./pages/time-picker"),
  transfer: () => import("./pages/transfer"),
  "tree-select": () => import("./pages/tree-select"),
  upload: () => import("./pages/upload"),
  "date-picker": () => import("./pages/date-picker"),
  calendar: () => import("./pages/calendar"),
  table: () => import("./pages/table"),
  tree: () => import("./pages/tree"),
  util: () => import("./pages/util"),
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
  carousel: () => import("./pages/carousel"),
  splitter: () => import("./pages/splitter"),
  watermark: () => import("./pages/watermark"),
  app: () => import("./pages/app"),
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
  const [failed, setFailed] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setFailed(null);
    const load = Object.hasOwn(pages, page) ? pages[page] : undefined;
    if (load)
      void load()
        .then((module) => {
          if (active) setLoaded({ id: page, Page: module.default });
        })
        .catch(() => {
          if (active) setFailed(page);
        });
    return () => {
      active = false;
    };
  }, [page]);
  const Page = loaded?.id === page ? loaded.Page : null;
  if (!Object.hasOwn(pages, page))
    return (
      <Result
        status="404"
        title="页面不存在"
        subTitle="请从文档导航选择一个页面。"
        extra={
          <Button type="primary" href="#overview">
            返回项目介绍
          </Button>
        }
      />
    );
  if (failed === page)
    return (
      <div role="alert">
        <Result
          status="error"
          title="文档加载失败"
          subTitle="请检查网络后重新加载页面。"
          extra={
            <Button onClick={() => window.location.reload()}>
              重新加载页面
            </Button>
          }
        />
      </div>
    );
  return Page ? <Page section={section} /> : <Loading />;
}
