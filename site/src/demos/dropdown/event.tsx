import type { MenuProps } from "antd-octane";
import { Dropdown, message, Space } from "antd-octane";
import { DownOutlined } from "../layout-navigation-icons";

const onClick: MenuProps["onClick"] = ({ key }) => {
  message.info(`Click on item ${key}`);
};

const items: MenuProps["items"] = [
  {
    label: "1st menu item",
    key: "1",
  },
  {
    label: "2nd menu item",
    key: "2",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

const App = () => (
  <Dropdown menu={{ items, onClick }}>
    {/* biome-ignore lint/a11y/useValidAnchor lint/a11y/noStaticElementInteractions: preserves the upstream dropdown trigger. */}
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me, Click menu item
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
