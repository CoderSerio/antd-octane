import { Breadcrumb, Icon } from "antd-octane";

export function IconsDemo() {
  return (
    <Breadcrumb
      items={[
        {
          key: "home",
          href: "#overview",
          title: (
            <>
              <Icon viewBox="0 0 24 24">
                <path
                  fill="none"
                  stroke="currentColor"
                  d="M3 10 12 3l9 7v11h-7v-7h-4v7H3z"
                />
              </Icon>{" "}
              首页
            </>
          ),
        },
        { key: "components", href: "#components", title: "组件" },
        { key: "breadcrumb", title: "面包屑" },
      ]}
    />
  );
}
