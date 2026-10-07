import type { MenuProps } from "antd-octane";
import { Dropdown, Space } from "antd-octane";
import { DownOutlined } from "../layout-navigation-icons";

const items: MenuProps["items"] = [
  {
    label: (
      <a
        href="https://www.antgroup.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        1st menu item
      </a>
    ),
    key: "0",
  },
  {
    label: (
      <a
        href="https://www.aliyun.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        2nd menu item
      </a>
    ),
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

const App = () => (
  <Dropdown menu={{ items }} trigger={["click"]}>
    {/* biome-ignore lint/a11y/useValidAnchor lint/a11y/noStaticElementInteractions: preserves the upstream dropdown trigger. */}
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Click me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
