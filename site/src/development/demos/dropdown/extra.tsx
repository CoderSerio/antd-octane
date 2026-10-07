/** biome-ignore-all lint/a11y/useValidAnchor: Preserve the upstream demonstration trigger links. */
// Adapted from Ant Design 5.29.3 (MIT), components/dropdown/demo/extra.tsx.

import type { MenuProps } from "antd-octane";
import { Dropdown, Space } from "antd-octane";
import { DownOutlined, SettingOutlined } from "../../icons";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "My Account",
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "2",
    label: "Profile",
    extra: "⌘P",
  },
  {
    key: "3",
    label: "Billing",
    extra: "⌘B",
  },
  {
    key: "4",
    label: "Settings",
    icon: <SettingOutlined />,
    extra: "⌘S",
  },
];

const App = () => (
  <Dropdown menu={{ items }}>
    <a href="#" onClick={(e) => e.preventDefault()}>
      <Space>
        Hover me
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default App;
