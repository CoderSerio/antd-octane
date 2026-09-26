import { Button, Input, Space, Watermark } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Watermark
      content={["Ant Design for Octane", "示例文档"]}
      style={{ width: "100%" }}
    >
      <div style={{ height: 240, padding: 24, boxSizing: "border-box" }}>
        <p>水印覆盖内容区域，同时保留选择文字和操作控件的能力。</p>
        <Input aria-label="水印下的输入" placeholder="仍然可以输入内容" />
      </div>
    </Watermark>
  );
}
const mark =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="48"><rect width="120" height="48" rx="8" fill="#1677ff" fill-opacity=".12"/><text x="60" y="30" text-anchor="middle" font-size="20" fill="#1677ff" fill-opacity=".45">Octane</text></svg>',
  );
export function MoreDemo() {
  const [image, setImage] = useState(false);
  const [rotate, setRotate] = useState(-22);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space wrap>
        <Button onClick={() => setImage(!image)}>
          {image ? "使用文字水印" : "使用图片水印"}
        </Button>
        <Button onClick={() => setRotate(rotate === 0 ? -22 : 0)}>
          切换旋转角度
        </Button>
      </Space>
      <Watermark
        image={image ? mark : undefined}
        content="内部资料 · 演示"
        rotate={rotate}
        gap={[48, 48]}
        offset={[16, 16]}
        style={{ width: "100%" }}
      >
        <div style={{ height: 220, padding: 24 }}>
          演示图为本地 SVG 数据地址；图片加载失败时回退到 content 文本。
        </div>
      </Watermark>
    </Space>
  );
}
