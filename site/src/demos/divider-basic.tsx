import { Divider } from "antd-octane";
export function BasicDemo() {
  return (
    <div style={{ width: "100%" }}>
      <p>将内容划分为清晰的阅读区块。</p>
      <Divider orientation="left">左侧标题</Divider>
      <p>主题变量决定分割线颜色。</p>
      <Divider dashed plain>
        虚线分割
      </Divider>
      <span>操作一</span>
      <Divider type="vertical" />
      <span>操作二</span>
    </div>
  );
}
