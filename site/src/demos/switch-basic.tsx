import { Space, Switch } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Space direction="vertical" size="middle">
      <Space>
        <Switch aria-label="接收通知" checked={checked} onChange={setChecked} />
        <span>通知：{checked ? "开启" : "关闭"}</span>
      </Space>
      <Space>
        <Switch aria-label="小号开关" size="small" defaultChecked />
        <Switch aria-label="加载中的开关" loading defaultChecked />
        <Switch aria-label="禁用的开关" disabled />
        <Switch
          aria-label="文字开关"
          checkedChildren="开"
          unCheckedChildren="关"
          defaultChecked
        />
      </Space>
    </Space>
  );
}
