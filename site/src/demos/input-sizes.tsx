import { Input } from "antd-octane";
export function InputSizesDemo() {
  return (
    <div className="input-examples">
      <Input size="large" placeholder="Large size" aria-label="大号输入" />
      <Input placeholder="Default size" aria-label="默认尺寸输入" />
      <Input size="small" placeholder="Small size" aria-label="小号输入" />
    </div>
  );
}
