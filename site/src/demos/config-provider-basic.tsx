import type { SizeType } from "antd-octane";
import {
  Alert,
  Button,
  Calendar,
  ConfigProvider,
  enUS,
  Input,
  Radio,
  Space,
  Switch,
  zhCN,
} from "antd-octane";
import { useState } from "octane";

export function LocaleDemo() {
  const [locale, setLocale] = useState<typeof zhCN | typeof enUS>(zhCN);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Radio.Group
        value={locale.locale}
        onChange={(event) =>
          setLocale(event.target.value === "en" ? enUS : zhCN)
        }
        options={[
          { label: "中文", value: "zh-cn" },
          { label: "English", value: "en" },
        ]}
      />
      <ConfigProvider locale={locale}>
        <div style={{ maxWidth: 360 }}>
          <Calendar fullscreen={false} />
        </div>
      </ConfigProvider>
    </Space>
  );
}

export function DirectionDemo() {
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Radio.Group
        value={direction}
        onChange={(event) => setDirection(event.target.value as "ltr" | "rtl")}
        options={[
          { label: "LTR", value: "ltr" },
          { label: "RTL", value: "rtl" },
        ]}
      />
      <ConfigProvider direction={direction}>
        <Space>
          <Button type="primary">Primary</Button>
          <Input placeholder="Input" />
        </Space>
      </ConfigProvider>
    </Space>
  );
}

export function SizeDemo() {
  const [size, setSize] = useState<SizeType>("middle");
  return (
    <Space direction="vertical">
      <Radio.Group
        value={size}
        onChange={(event) => setSize(event.target.value as SizeType)}
        options={[
          { label: "Small", value: "small" },
          { label: "Middle", value: "middle" },
          { label: "Large", value: "large" },
        ]}
      />
      <ConfigProvider componentSize={size}>
        <Space>
          <Button type="primary">Primary</Button>
          <Input placeholder="Input" />
        </Space>
      </ConfigProvider>
    </Space>
  );
}

export function ThemeDemo() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#00b96b" } }}>
      <Space>
        <Button type="primary">Primary Button</Button>
        <Input placeholder="Input" />
      </Space>
    </ConfigProvider>
  );
}

export function WaveDemo() {
  const [disabled, setDisabled] = useState(false);
  return (
    <Space direction="vertical">
      <Switch
        checked={!disabled}
        onChange={(checked) => setDisabled(!checked)}
      />
      <Space>
        <ConfigProvider wave={{ disabled }}>
          <Button type="primary">{disabled ? "波纹已关闭" : "默认波纹"}</Button>
        </ConfigProvider>
        <ConfigProvider
          wave={{
            showEffect: (node, { component }) => {
              if (component !== "Button") return;
              node.animate(
                [
                  { transform: "scale(1)", opacity: 1 },
                  { transform: "scale(1.06)", opacity: 0.65 },
                  { transform: "scale(1)", opacity: 1 },
                ],
                { duration: 260, easing: "ease-out" },
              );
            },
          }}
        >
          <Button>自定义波纹</Button>
        </ConfigProvider>
      </Space>
    </Space>
  );
}

function ConfigValues() {
  const { componentDisabled, componentSize } = ConfigProvider.useConfig();
  return (
    <Space direction="vertical">
      <div>Size: {componentSize}</div>
      <div>Disabled: {String(componentDisabled)}</div>
      <Button>Button</Button>
    </Space>
  );
}

export function UseConfigDemo() {
  const [disabled, setDisabled] = useState(false);
  return (
    <Space direction="vertical">
      <Switch checked={disabled} onChange={setDisabled} />
      <ConfigProvider componentSize="small" componentDisabled={disabled}>
        <ConfigValues />
      </ConfigProvider>
    </Space>
  );
}

export function PrefixClsDemo() {
  const [prefixCls, setPrefixCls] = useState("light");
  return (
    <Space direction="vertical">
      <Button
        type="primary"
        onClick={() => setPrefixCls(prefixCls === "light" ? "dark" : "light")}
      >
        切换 prefixCls
      </Button>
      <ConfigProvider prefixCls={prefixCls} iconPrefixCls="octane-icon">
        <Space>
          <Button>Button</Button>
          <Input placeholder="Input" />
          <Radio>Radio</Radio>
        </Space>
      </ConfigProvider>
    </Space>
  );
}

export function WarningDemo() {
  return (
    <ConfigProvider warning={{ strict: false }}>
      <Space direction="vertical">
        <Alert message="在开发环境中检查废弃属性警告" />
        <Input.Group />
      </Space>
    </ConfigProvider>
  );
}
