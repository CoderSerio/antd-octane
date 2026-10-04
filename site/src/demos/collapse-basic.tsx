import { Button, Collapse } from "antd-octane";
export function BasicDemo() {
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  return (
    <Collapse
      items={[
        { key: "1", label: "This is panel header 1", children: <p>{text}</p> },
        { key: "2", label: "This is panel header 2", children: <p>{text}</p> },
        { key: "3", label: "This is panel header 3", children: <p>{text}</p> },
      ]}
      defaultActiveKey={["1"]}
    />
  );
}
export function MixDemo() {
  const text = "嵌套的折叠面板内容。";
  return (
    <Collapse
      style={{ width: "100%" }}
      defaultActiveKey={["1"]}
      items={[
        {
          key: "1",
          label: "This is panel header 1",
          children: (
            <>
              <p>{text}</p>
              <Collapse defaultActiveKey={["nested"]}>
                <Collapse.Panel key="nested" header="This is panel nest panel">
                  <p>{text}</p>
                </Collapse.Panel>
              </Collapse>
            </>
          ),
        },
        { key: "2", label: "This is panel header 2", children: <p>{text}</p> },
        { key: "3", label: "This is panel header 3", children: <p>{text}</p> },
      ]}
    />
  );
}

export function BorderlessDemo() {
  const text = (
    <p style={{ paddingInlineStart: 24 }}>
      A dog is a type of domesticated animal. Known for its loyalty and
      faithfulness, it can be found as a welcome guest in many households across
      the world.
    </p>
  );
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={["1"]}
      items={[
        { key: "1", label: "This is panel header 1", children: text },
        { key: "2", label: "This is panel header 2", children: text },
        { key: "3", label: "This is panel header 3", children: text },
      ]}
    />
  );
}

export function SizeDemo() {
  return (
    <Collapse size="small" defaultActiveKey={["1"]} style={{ width: "100%" }}>
      <Collapse.Panel key="1" header="小尺寸面板">
        面板内容
      </Collapse.Panel>
      <Collapse.Panel key="2" header="第二项">
        面板内容
      </Collapse.Panel>
    </Collapse>
  );
}

export function AccordionDemo() {
  return (
    <Collapse accordion defaultActiveKey={["1"]} style={{ width: "100%" }}>
      <Collapse.Panel key="1" header="第一项">
        一次只展开一项。
      </Collapse.Panel>
      <Collapse.Panel key="2" header="第二项">
        切换时自动关闭其他项。
      </Collapse.Panel>
      <Collapse.Panel key="3" header="第三项">
        手风琴交互。
      </Collapse.Panel>
    </Collapse>
  );
}

export function NestedDemo() {
  return (
    <Collapse defaultActiveKey={["outer"]} style={{ width: "100%" }}>
      <Collapse.Panel key="outer" header="外层面板">
        <Collapse defaultActiveKey={["inner"]}>
          <Collapse.Panel key="inner" header="内层面板">
            嵌套内容
          </Collapse.Panel>
        </Collapse>
      </Collapse.Panel>
    </Collapse>
  );
}

export function GhostDemo() {
  return (
    <Collapse ghost defaultActiveKey={["1"]} style={{ width: "100%" }}>
      <Collapse.Panel key="1" header="幽灵折叠面板">
        背景和边框会被移除。
      </Collapse.Panel>
      <Collapse.Panel key="2" header="第二项">
        内容
      </Collapse.Panel>
    </Collapse>
  );
}

export function CustomDemo() {
  return (
    <Collapse defaultActiveKey={["1"]} style={{ width: "100%" }}>
      <Collapse.Panel key="1" header={<strong>自定义标题</strong>}>
        标题可以是任意节点。
      </Collapse.Panel>
      <Collapse.Panel key="2" header="普通标题">
        内容
      </Collapse.Panel>
    </Collapse>
  );
}

export function NoArrowDemo() {
  return (
    <Collapse defaultActiveKey={["1"]} style={{ width: "100%" }}>
      <Collapse.Panel key="1" header="隐藏箭头" showArrow={false}>
        这个面板没有展开图标。
      </Collapse.Panel>
      <Collapse.Panel key="2" header="默认箭头">
        内容
      </Collapse.Panel>
    </Collapse>
  );
}

export function ExtraDemo() {
  return (
    <Collapse defaultActiveKey={["1"]} style={{ width: "100%" }}>
      <Collapse.Panel
        key="1"
        header="额外节点"
        extra={<Button size="small">操作</Button>}
      >
        额外节点不会替代面板内容。
      </Collapse.Panel>
    </Collapse>
  );
}

export function TriggerDemo() {
  return (
    <Collapse style={{ width: "100%" }}>
      <Collapse.Panel key="header" header="只能点击标题" collapsible="header">
        只有标题区域触发展开。
      </Collapse.Panel>
      <Collapse.Panel key="icon" header="只能点击图标" collapsible="icon">
        只有图标区域触发展开。
      </Collapse.Panel>
    </Collapse>
  );
}
