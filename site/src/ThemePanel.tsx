import { Button, Form, Input, Slider, Switch, theme } from "antd-octane";
import { useEffect } from "octane";
import type { ShellProps } from "./App";
export function ThemePanel(p: ShellProps & { onClose: () => void }) {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const values = {
    primary: p.primary,
    radius: p.radius,
    dark: p.dark,
    compact: p.compact,
  };
  useEffect(() => {
    form.setFieldsValue(values);
  }, [form, p.primary, p.radius, p.dark, p.compact]);
  return (
    <Form
      form={form}
      initialValues={values}
      layout="vertical"
      className="theme-panel"
      style={{ color: token.colorText }}
      onValuesChange={(changed) => {
        if (typeof changed.primary === "string") p.setPrimary(changed.primary);
        if (typeof changed.radius === "number") p.setRadius(changed.radius);
        if (typeof changed.dark === "boolean") p.setDark(changed.dark);
        if (typeof changed.compact === "boolean") p.setCompact(changed.compact);
      }}
    >
      <p>调整配置，实时预览组件。</p>
      <p className="control-title">品牌色预设</p>
      <div className="swatches">
        {["#1677ff", "#722ed1", "#13a8a8", "#389e0d", "#eb2f96"].map(
          (color) => (
            <Button
              type="text"
              key={color}
              aria-label={`主色 ${color}`}
              aria-pressed={p.primary === color}
              style={{ background: color }}
              onClick={() => p.setPrimary(color)}
            >
              {p.primary === color ? "✓" : ""}
            </Button>
          ),
        )}
      </div>
      <Form.Item
        name="primary"
        label={
          <>
            自定义品牌色 <code>{p.primary}</code>
          </>
        }
      >
        <Input id="primary-color" type="color" aria-label="自定义品牌色" />
      </Form.Item>
      <Form.Item
        name="radius"
        label={
          <>
            圆角 <code>{p.radius}px</code>
          </>
        }
      >
        <Slider id="radius" aria-label="圆角" min={0} max={20} />
      </Form.Item>
      <Form.Item name="dark" label="暗色模式" valuePropName="checked">
        <Switch id="site-dark" aria-label="暗色模式" />
      </Form.Item>
      <Form.Item name="compact" label="紧凑模式" valuePropName="checked">
        <Switch id="site-compact" aria-label="紧凑模式" />
      </Form.Item>
      <div className="token-preview">
        <span>派生 Token</span>
        <div>
          <code>colorPrimaryHover</code>
          <i style={{ background: token.colorPrimaryHover }} />
        </div>
        <div>
          <code>controlHeight</code>
          <b>{token.controlHeight}px</b>
        </div>
        <div>
          <code>borderRadius</code>
          <b>{token.borderRadius}px</b>
        </div>
      </div>
      <Button
        block
        onClick={() => {
          p.setDark(false);
          p.setCompact(false);
          p.setPrimary("#1677ff");
          p.setRadius(6);
        }}
      >
        重置主题
      </Button>
      <Button
        className="panel-link"
        type="text"
        href="#theme"
        onClick={p.onClose}
      >
        了解主题迁移 →
      </Button>
    </Form>
  );
}
