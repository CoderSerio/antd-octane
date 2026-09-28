import { Space, Typography } from "antd-octane";
import { useState } from "octane";
export function CopyableDemo() {
  const [copies, setCopies] = useState(0);
  return (
    <Space direction="vertical">
      <Typography.Paragraph copyable>这段内容可直接复制。</Typography.Paragraph>
      <Typography.Paragraph
        copyable={{
          text: "pnpm add antd-octane@alpha",
          onCopy: () => setCopies(copies + 1),
        }}
      >
        复制安装命令（复制内容与显示文案不同）
      </Typography.Paragraph>
      <Typography.Paragraph
        copyable={{ text: async () => "https://example.com/shared/document" }}
      >
        异步取得分享地址并复制
      </Typography.Paragraph>
      <span role="status">安装命令已复制 {copies} 次</span>
    </Space>
  );
}
