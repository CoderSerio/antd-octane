import { Button, Dropdown } from "antd-octane";
import { useState } from "octane";

export function ContextDemo() {
  const [action, setAction] = useState("尚未选择");
  return (
    <div>
      <Dropdown
        trigger={["contextMenu"]}
        menu={{
          items: [
            { key: "open", label: "打开" },
            { key: "copy", label: "复制" },
          ],
          onClick: (info) => setAction(info.key),
        }}
      >
        <Button
          type="dashed"
          block
          style={{
            height: "auto",
            padding: 32,
            background: "var(--subtle)",
            color: "inherit",
          }}
        >
          右键打开菜单；键盘可按 ↓
        </Button>
      </Dropdown>
      <p aria-live="polite">本地操作：{action}</p>
    </div>
  );
}
