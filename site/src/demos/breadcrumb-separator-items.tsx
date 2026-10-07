import { Breadcrumb } from "antd-octane";

export function SeparatorItemsDemo() {
  return (
    <Breadcrumb
      separator=""
      items={[
        {
          title: "Location",
        },
        {
          type: "separator",
          separator: ":",
        },
        {
          href: "",
          title: "Application Center",
        },
        {
          type: "separator",
        },
        {
          href: "",
          title: "Application List",
        },
        {
          type: "separator",
        },
        {
          title: "An Application",
        },
      ]}
    />
  );
}
