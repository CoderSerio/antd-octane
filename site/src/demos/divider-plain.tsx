import { Divider } from "antd-octane";

export function PlainDemo() {
  return (
    <div style={{ width: "100%" }}>
      <Divider>标题样式</Divider>
      <p>默认标题使用较大的字号与字重。</p>
      <Divider plain>正文样式</Divider>
      <p>plain 使用正文的字号与字重，适合次要分组。</p>
    </div>
  );
}
