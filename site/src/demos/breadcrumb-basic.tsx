import { Breadcrumb } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Breadcrumb
      items={[
        { title: "首页", href: "#overview" },
        { title: "组件", href: "#components" },
        { title: "面包屑" },
      ]}
    />
  );
}
export function MoreDemo() {
  const [selected, setSelected] = useState("订单详情");
  return (
    <>
      <Breadcrumb
        separator=">"
        items={[
          { title: "工作台", onClick: () => setSelected("工作台") },
          { title: "订单列表", onClick: () => setSelected("订单列表") },
          { title: selected },
        ]}
      />
      <p aria-live="polite">当前区域：{selected}</p>
    </>
  );
}
