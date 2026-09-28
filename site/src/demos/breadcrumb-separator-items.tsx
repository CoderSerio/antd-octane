import { Breadcrumb } from "antd-octane";

export function SeparatorItemsDemo() {
  return (
    <Breadcrumb
      separator=""
      items={[
        { key: "home", title: "首页", href: "#overview" },
        { key: "first-divider", type: "separator", separator: ":" },
        { key: "components", title: "组件", href: "#components" },
        { key: "second-divider", type: "separator", separator: ">" },
        { key: "current", title: "当前页面" },
      ]}
    />
  );
}
