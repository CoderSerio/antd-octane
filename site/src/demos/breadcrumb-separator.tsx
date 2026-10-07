import { Breadcrumb } from "antd-octane";

export function SeparatorDemo() {
  return (
    <Breadcrumb
      separator=">"
      items={[
        {
          title: "Home",
        },
        {
          title: "Application Center",
          href: "",
        },
        {
          title: "Application List",
          href: "",
        },
        {
          title: "An Application",
        },
      ]}
    />
  );
}
