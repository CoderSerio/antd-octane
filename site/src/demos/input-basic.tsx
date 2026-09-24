import { Input } from "antd-octane";
export function InputBasicDemo() {
  return (
    <div className="input-examples">
      <Input placeholder="请输入内容" aria-label="基础输入" />
      <Input defaultValue="Ant Design for Octane" aria-label="默认内容" />
    </div>
  );
}
