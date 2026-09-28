import { Button, Input, Space, Watermark } from "antd-octane";
import { useState } from "octane";

export function ConfigDemo() {
  const [content, setContent] = useState("项目预览");
  const [large, setLarge] = useState(false);
  const [dense, setDense] = useState(false);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        value={content}
        onChange={(event) => setContent(event.target.value)}
        aria-label="水印内容"
        placeholder="填写水印文字"
      />
      <Space wrap>
        <Button onClick={() => setLarge(!large)}>切换字号</Button>
        <Button onClick={() => setDense(!dense)}>切换密度</Button>
      </Space>
      <Watermark
        content={content}
        font={{
          fontSize: large ? 24 : 14,
          fontWeight: 600,
          color: "rgba(22,119,255,0.25)",
        }}
        gap={dense ? [32, 32] : [100, 100]}
        style={{ width: "100%" }}
      >
        <div style={{ minHeight: 220, padding: 20 }}>
          <p>修改文字、字号与间距可即时预览水印。</p>
          <Input
            aria-label="受水印覆盖的备注"
            placeholder="水印层不会阻挡输入"
          />
        </div>
      </Watermark>
    </Space>
  );
}
