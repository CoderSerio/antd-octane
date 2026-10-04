import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Select,
  Space,
  Tooltip,
} from "antd-octane";
import type { HTMLAttributes } from "octane";
import { useEffect, useRef, useState } from "octane";
export function BasicDemo() {
  return (
    <Tooltip title="prompt text">
      <span>Tooltip will show on mouse enter.</span>
    </Tooltip>
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

export function ArrowDemo() {
  return (
    <Space wrap>
      <Tooltip title="默认箭头">
        <Button>默认</Button>
      </Tooltip>
      <Tooltip title="无箭头" arrow={false}>
        <Button>隐藏箭头</Button>
      </Tooltip>
      <Tooltip title="箭头指向中心" arrow={{ pointAtCenter: true }}>
        <Button>指向中心</Button>
      </Tooltip>
    </Space>
  );
}

export function OffsetDemo() {
  return (
    <Tooltip title="向下偏移 12px" align={{ offset: [0, 12] }}>
      <Button>偏移</Button>
    </Tooltip>
  );
}

export function ColorDemo() {
  return (
    <Space wrap>
      <Tooltip title="品牌色提示" color="#1677ff">
        <Button>品牌色</Button>
      </Tooltip>
      <Tooltip title="成功提示" color="green">
        <Button>绿色</Button>
      </Tooltip>
      <Tooltip title="警告提示" color="gold">
        <Button>金色</Button>
      </Tooltip>
    </Space>
  );
}

export function DisabledDemo() {
  const [disabled, setDisabled] = useState(true);
  return (
    <Tooltip title={disabled ? null : "prompt text"}>
      <Button onClick={() => setDisabled(!disabled)}>
        {disabled ? "Enable" : "Disable"}
      </Button>
    </Tooltip>
  );
}

function ComponentWithEvents(props: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props}>
      This text is inside a component with the necessary events exposed.
    </span>
  );
}

export function CustomDemo() {
  return (
    <Tooltip title="prompt text">
      <ComponentWithEvents />
    </Tooltip>
  );
}

export function AutoAdjustOverflowDemo() {
  const host = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (host.current) host.current.scrollLeft = host.current.clientWidth / 2;
  }, []);
  return (
    <div
      ref={host}
      style={{
        overflow: "auto",
        padding: 24,
        border: "1px solid #e9e9e9",
      }}
    >
      <div
        style={{
          width: "200%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Tooltip
          title="自动调整位置"
          placement="left"
          getPopupContainer={(trigger) =>
            trigger.parentElement ?? document.body
          }
        >
          <Button>自动调整</Button>
        </Tooltip>
        <Tooltip
          title="关闭自动调整"
          placement="left"
          autoAdjustOverflow={false}
        >
          <Button>不调整</Button>
        </Tooltip>
      </div>
    </div>
  );
}

export function DestroyOnCloseDemo() {
  return (
    <Tooltip destroyOnHidden title="关闭后销毁浮层内容">
      <Button>打开提示</Button>
    </Tooltip>
  );
}

export function DisabledChildrenDemo() {
  const title = "禁用元素也可以显示提示";
  return (
    <Space wrap>
      <Tooltip title={title}>
        <Button disabled>Button</Button>
      </Tooltip>
      <Tooltip title={title}>
        <Input disabled placeholder="Input" style={{ width: 120 }} />
      </Tooltip>
      <Tooltip title={title}>
        <InputNumber disabled placeholder="Number" />
      </Tooltip>
      <Tooltip title={title}>
        <Checkbox disabled>Checkbox</Checkbox>
      </Tooltip>
      <Tooltip title={title}>
        <Select disabled placeholder="Select" style={{ width: 120 }} />
      </Tooltip>
    </Space>
  );
}
