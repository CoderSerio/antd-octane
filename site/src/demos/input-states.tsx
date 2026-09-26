import { Input } from "antd-octane";
export function InputStatesDemo() {
  return (
    <div className="input-examples">
      <Input status="error" placeholder="错误状态" aria-label="错误状态" />
      <Input status="warning" placeholder="警告状态" aria-label="警告状态" />
      <Input disabled defaultValue="禁用状态" aria-label="禁用状态" />
      <Input
        readOnly
        defaultValue="只读内容可以选择和复制"
        aria-label="只读状态"
      />
    </div>
  );
}
