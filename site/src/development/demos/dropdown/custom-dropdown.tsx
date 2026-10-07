/** biome-ignore-all lint/a11y/useValidAnchor: Preserve the upstream demonstration trigger links. */
// Adapted from Ant Design 5.29.3 (MIT), components/dropdown/demo/custom-dropdown.tsx.

import type { MenuProps } from "antd-octane";
import { Button, Divider, Dropdown, Space, theme } from "antd-octane";
import type { CSSProperties, ElementDescriptor } from "octane";
import { cloneElement } from "octane";
import { DownOutlined } from "../../icons";

const { useToken } = theme;

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
];

const App = () => {
  const { token } = useToken();

  const contentStyle: CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: CSSProperties = {
    boxShadow: "none",
  };

  return (
    <Dropdown
      menu={{ items }}
      popupRender={(menu) => (
        <div style={contentStyle}>
          {cloneElement(menu as ElementDescriptor, { style: menuStyle })}
          <Divider style={{ margin: 0 }} />
          <Space style={{ padding: 8 }}>
            <Button type="primary">Click me!</Button>
          </Space>
        </div>
      )}
    >
      <a href="#" onClick={(e) => e.preventDefault()}>
        <Space>
          Hover me
          <DownOutlined />
        </Space>
      </a>
    </Dropdown>
  );
};

export default App;
