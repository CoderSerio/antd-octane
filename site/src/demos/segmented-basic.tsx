import { Button, Flex, Segmented } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Segmented
      options={["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]}
      onChange={() => undefined}
    />
  );
}
export function MoreDemo() {
  const [value, setValue] = useState<string | number>("项目");
  return (
    <Flex vertical gap={16} style={{ width: "100%" }}>
      <Segmented
        block
        options={["项目", "成员", "设置"]}
        value={value}
        onChange={setValue}
        aria-label="工作区视图"
      />
      <p>当前视图：{value}</p>
      <Segmented
        vertical
        shape="round"
        options={["总览", "活动", "收藏"]}
        aria-label="导航方向"
      />
    </Flex>
  );
}

export function ControlledDemo() {
  const [value, setValue] = useState<string | number>("Map");
  return (
    <Segmented
      options={["Map", "Transit", "Satellite"]}
      value={value}
      onChange={setValue}
    />
  );
}

export function VerticalDemo() {
  return <Segmented vertical options={["总览", "活动", "收藏"]} />;
}

export function BlockDemo() {
  return <Segmented block options={["按日", "按周", "按月"]} />;
}

export function ShapeDemo() {
  return <Segmented shape="round" options={["全部", "进行中", "已完成"]} />;
}

export function DisabledDemo() {
  return (
    <Flex gap={16}>
      <Segmented disabled options={["全部", "已读", "未读"]} />
      <Segmented options={["可用", { value: "禁用", disabled: true }]} />
    </Flex>
  );
}

export function CustomRenderDemo() {
  return (
    <Segmented
      options={[
        { value: "all", label: <strong>全部</strong> },
        {
          value: "active",
          label: <span style={{ color: "#1677ff" }}>进行中</span>,
        },
        { value: "done", label: <span>已完成 ✓</span> },
      ]}
    />
  );
}

export function DynamicDemo() {
  const [options, setOptions] = useState(["项目", "成员"]);
  return (
    <Flex gap={12} vertical>
      <Segmented options={options} />
      <Button
        onClick={() => setOptions([...options, `新选项 ${options.length + 1}`])}
      >
        添加选项
      </Button>
    </Flex>
  );
}

export function SizesDemo() {
  return (
    <Flex vertical gap={12}>
      <Segmented size="small" options={["小", "尺寸"]} />
      <Segmented options={["中", "尺寸"]} />
      <Segmented size="large" options={["大", "尺寸"]} />
    </Flex>
  );
}

export function IconDemo() {
  return (
    <Segmented
      options={[
        {
          value: "list",
          icon: <span aria-hidden="true">☷</span>,
          label: "列表",
        },
        {
          value: "kanban",
          icon: <span aria-hidden="true">▦</span>,
          label: "看板",
        },
        {
          value: "calendar",
          icon: <span aria-hidden="true">□</span>,
          label: "日历",
        },
      ]}
    />
  );
}

export function IconOnlyDemo() {
  return (
    <Segmented
      aria-label="视图"
      options={[
        {
          value: "list",
          icon: <span aria-hidden="true">☷</span>,
          title: "列表",
        },
        {
          value: "grid",
          icon: <span aria-hidden="true">▦</span>,
          title: "网格",
        },
      ]}
    />
  );
}

export function NameDemo() {
  return <Segmented name="view-mode" options={["预览", "代码", "文档"]} />;
}

export function ControlledTwoDemo() {
  const [value, setValue] = useState<string | number>("AND");
  return (
    <Flex gap={8} wrap>
      <Segmented
        value={value}
        options={["AND", "OR", "NOT"]}
        onChange={setValue}
      />
      <Segmented
        value={value}
        options={["AND", "OR", "NOT"]}
        onChange={setValue}
      />
    </Flex>
  );
}

export function SizeConsistentDemo() {
  return (
    <Flex gap={8} vertical>
      <div>
        <Segmented
          size="large"
          style={{ marginInlineEnd: 6 }}
          options={["Daily", "Weekly", "Monthly"]}
        />
        <Button type="primary" size="large">
          Button
        </Button>
      </div>
      <div>
        <Segmented
          style={{ marginInlineEnd: 6 }}
          options={["Daily", "Weekly", "Monthly"]}
        />
        <Button>Button</Button>
      </div>
      <div>
        <Segmented
          size="small"
          style={{ marginInlineEnd: 6 }}
          options={["Daily", "Weekly", "Monthly"]}
        />
        <Button size="small">Button</Button>
      </div>
    </Flex>
  );
}
