import { Button } from "antd-octane";
export function SizesDemo() {
  return (
    <div className="demo-row">
      <Button type="primary" size="large">
        Large
      </Button>
      <Button type="primary">Middle</Button>
      <Button type="primary" size="small">
        Small
      </Button>
      <Button shape="round">Round</Button>
      <Button shape="circle" aria-label="添加" icon={<span>+</span>} />
    </div>
  );
}
