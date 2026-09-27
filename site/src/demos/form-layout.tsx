import { Button, Form, Input } from "antd-octane";
import { useState } from "octane";

export function FormLayoutDemo() {
  const [layout, setLayout] = useState<"horizontal" | "vertical" | "inline">(
    "horizontal",
  );
  return (
    <div>
      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}
      >
        <Button
          type={layout === "horizontal" ? "primary" : "default"}
          onClick={() => setLayout("horizontal")}
        >
          横向
        </Button>
        <Button
          type={layout === "vertical" ? "primary" : "default"}
          onClick={() => setLayout("vertical")}
        >
          纵向
        </Button>
        <Button
          type={layout === "inline" ? "primary" : "default"}
          onClick={() => setLayout("inline")}
        >
          行内
        </Button>
      </div>
      <Form layout={layout} style={{ maxWidth: 420 }}>
        <Form.Item name="name" label="姓名" help="请输入展示名称">
          <Input aria-label="姓名" placeholder="例如 Octane" />
        </Form.Item>
        <Form.Item name="team" label="团队">
          <Input aria-label="团队" placeholder="例如设计系统" />
        </Form.Item>
      </Form>
    </div>
  );
}
