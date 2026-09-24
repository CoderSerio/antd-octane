import { Button, theme } from "antd-octane";
import type { ShellProps } from "./App";
export function ThemePanel(p: ShellProps) {
  const { token } = theme.useToken();
  return (
    <div className="theme-panel">
      {" "}
      <div className="panel-heading">
        <span className="spark">✦</span>
        <h2 id="theme-title">主题实验室</h2>
        <button
          type="button"
          className="close-panel"
          aria-label="关闭主题实验室"
          onClick={() =>
            (
              document.getElementById("theme-dialog") as HTMLDialogElement
            ).close()
          }
        >
          ×
        </button>
      </div>
      <p>调整配置，实时预览组件。</p>
      <label className="control-title" htmlFor="primary-color">
        品牌色 <code>{p.primary}</code>
      </label>
      <div className="swatches">
        {["#1677ff", "#722ed1", "#13a8a8", "#389e0d", "#eb2f96"].map(
          (color) => (
            <button
              type="button"
              key={color}
              aria-label={`主色 ${color}`}
              aria-pressed={p.primary === color}
              style={{ background: color }}
              onClick={() => p.setPrimary(color)}
            >
              {p.primary === color ? "✓" : ""}
            </button>
          ),
        )}
        <input
          id="primary-color"
          aria-label="自定义品牌色"
          type="color"
          value={p.primary}
          onInput={(event) =>
            p.setPrimary((event.currentTarget as HTMLInputElement).value)
          }
        />
      </div>
      <label className="control-title" htmlFor="radius">
        圆角 <code>{p.radius}px</code>
      </label>
      <input
        id="radius"
        type="range"
        min="0"
        max="20"
        value={p.radius}
        onInput={(event) =>
          p.setRadius(Number((event.currentTarget as HTMLInputElement).value))
        }
      />
      <label className="check-control">
        <span>暗色模式</span>
        <input
          type="checkbox"
          checked={p.dark}
          onChange={(event) =>
            p.setDark((event.currentTarget as HTMLInputElement).checked)
          }
        />
      </label>
      <label className="check-control">
        <span>紧凑模式</span>
        <input
          type="checkbox"
          checked={p.compact}
          onChange={(event) =>
            p.setCompact((event.currentTarget as HTMLInputElement).checked)
          }
        />
      </label>
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
      <button
        className="panel-link"
        type="button"
        onClick={() => {
          (
            document.getElementById("theme-dialog") as HTMLDialogElement
          ).close();
          window.location.hash = "theme";
        }}
      >
        了解主题迁移 →
      </button>
    </div>
  );
}
