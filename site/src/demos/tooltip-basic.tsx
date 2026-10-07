import { Button, Space, Tooltip } from "antd-octane";
export function BasicDemo() {
  return (
    <Space wrap>
      <Tooltip title="保存当前编辑内容" trigger={["hover", "focus"]}>
        <Button>悬停或聚焦</Button>
      </Tooltip>
      <Tooltip
        title="使用自定义背景色"
        color="#1677ff"
        trigger={["hover", "focus"]}
      >
        <Button>品牌色提示</Button>
      </Tooltip>
    </Space>
  );
}
export function MoreDemo() {
  return (
    <Space wrap>
      {(
        [
          "topLeft",
          "top",
          "topRight",
          "bottomLeft",
          "bottom",
          "bottomRight",
          "leftTop",
          "left",
          "leftBottom",
          "rightTop",
          "right",
          "rightBottom",
        ] as const
      ).map((placement) => (
        <Tooltip
          key={placement}
          title={`位置：${placement}`}
          placement={placement}
          trigger={["hover", "focus"]}
        >
          <Button>{placement}</Button>
        </Tooltip>
      ))}
    </Space>
  );
}
