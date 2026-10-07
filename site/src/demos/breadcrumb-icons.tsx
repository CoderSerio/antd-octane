import { Breadcrumb } from "antd-octane";
import { HomeOutlined, UserOutlined } from "./layout-navigation-icons";

export function IconsDemo() {
  return (
    <Breadcrumb
      items={[
        {
          href: "",
          title: <HomeOutlined />,
        },
        {
          href: "",
          title: (
            <>
              <UserOutlined />
              <span>Application List</span>
            </>
          ),
        },
        {
          title: "Application",
        },
      ]}
    />
  );
}
