import { Breadcrumb, Button, Space } from "antd-octane";
import { useState } from "octane";

const path = ["工作台", "项目 A", "设置", "成员权限"];

export function PathNavigationDemo() {
  const [depth, setDepth] = useState(2);
  return (
    <Space direction="vertical">
      <Breadcrumb
        separator="›"
        items={path.slice(0, depth + 1).map((title, index) => ({
          key: title,
          title,
          onClick: index < depth ? () => setDepth(index) : undefined,
        }))}
      />
      <Space wrap>
        <Button
          disabled={depth === path.length - 1}
          onClick={() => setDepth(depth + 1)}
        >
          进入下一级
        </Button>
        <Button disabled={depth === 0} onClick={() => setDepth(depth - 1)}>
          返回上一级
        </Button>
      </Space>
      <p aria-live="polite">当前位置：{path[depth]}</p>
    </Space>
  );
}
