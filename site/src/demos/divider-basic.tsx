import { Divider } from "antd-octane";
export function BasicDemo() {
  return (
    <div style={{ width: "100%" }}>
      <p>将内容划分为清晰的阅读区块。</p>
      <Divider />
      <p>主题变量决定分割线颜色。</p>
      <Divider />
      <p>分隔线本身是静态语义，不提供拖拽交互。</p>
    </div>
  );
}
