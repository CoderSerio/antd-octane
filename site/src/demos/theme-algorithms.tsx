import {
  Button,
  ConfigProvider,
  Input,
  Space,
  Switch,
  theme,
} from "antd-octane";
import { useState } from "octane";
export function ThemeAlgorithmsDemo() {
  const [dark, setDark] = useState(false);
  const [compact, setCompact] = useState(false);
  const config = {
    algorithm: [
      dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      ...(compact ? [theme.compactAlgorithm] : []),
    ],
  };
  const token = theme.getDesignToken(config);
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space wrap>
        <Switch aria-label="示例暗色算法" checked={dark} onChange={setDark} />
        <span>暗色</span>
        <Switch
          aria-label="示例紧凑算法"
          checked={compact}
          onChange={setCompact}
        />
        <span>紧凑</span>
      </Space>
      <ConfigProvider theme={config}>
        <Space
          wrap
          style={{
            padding: 24,
            width: "100%",
            boxSizing: "border-box",
            borderRadius: token.borderRadius,
            background: token.colorBgContainer,
          }}
        >
          <Input
            aria-label="主题示例输入"
            placeholder="请输入内容"
            style={{ width: 180 }}
          />
          <Button type="primary">提交</Button>
          <Switch aria-label="主题示例开关" defaultChecked />
        </Space>
      </ConfigProvider>
    </Space>
  );
}
