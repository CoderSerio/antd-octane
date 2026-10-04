import { Button, Space, Tour } from "antd-octane";
import { useRef, useState } from "octane";
export function BasicDemo() {
  const upload = useRef<HTMLSpanElement | null>(null);
  const save = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  return (
    <>
      <Space wrap>
        <Button
          type="primary"
          onClick={() => {
            setCurrent(0);
            setOpen(true);
            setFinished(false);
          }}
        >
          开始引导
        </Button>
        <span ref={upload} style={{ display: "inline-flex" }}>
          <Button>上传文件</Button>
        </span>
        <span ref={save} style={{ display: "inline-flex" }}>
          <Button>保存项目</Button>
        </span>
      </Space>
      {finished && <p role="status">已完成引导</p>}
      <Tour
        open={open}
        current={current}
        onChange={setCurrent}
        onClose={() => setOpen(false)}
        onFinish={() => {
          setOpen(false);
          setFinished(true);
        }}
        actionsRender={(actions, { current, total }) => (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {actions}
            <span>
              {current + 1}/{total}
            </span>
          </div>
        )}
        steps={[
          {
            target: () => upload.current,
            title: "上传文件",
            description: "将需要处理的文件上传到项目中。",
          },
          {
            target: () => save.current,
            title: "保存项目",
            description: "保存当前操作，稍后可以继续。",
            type: "primary",
          },
          { title: "准备就绪", description: "没有目标元素的步骤会居中显示。" },
        ]}
      />
    </>
  );
}

function ExampleTour({
  variant,
}: {
  variant: "non-modal" | "placement" | "mask" | "indicator" | "actions" | "gap";
}) {
  const first = useRef<HTMLSpanElement | null>(null);
  const second = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  const steps = [
    {
      target: () => first.current,
      title: "上传文件",
      description: "把文件放到项目中。",
      ...(variant === "mask"
        ? { mask: { color: "rgba(40, 0, 255, .35)" } }
        : {}),
    },
    {
      target: () => second.current,
      title: "保存项目",
      description: "保存当前修改。",
      placement: variant === "placement" ? ("right" as const) : undefined,
      ...(variant === "mask" ? { mask: false } : {}),
    },
    { title: "完成", description: "没有目标的步骤居中显示。" },
  ];
  return (
    <>
      <Space wrap>
        <Button type="primary" onClick={() => setOpen(true)}>
          开始引导
        </Button>
        <span ref={first} style={{ display: "inline-flex" }}>
          <Button>上传</Button>
        </span>
        <span ref={second} style={{ display: "inline-flex" }}>
          <Button>保存</Button>
        </span>
      </Space>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
        steps={steps}
        type={variant === "non-modal" ? "primary" : "default"}
        mask={
          variant === "non-modal"
            ? false
            : variant === "mask"
              ? {
                  color: "rgba(0, 0, 0, .45)",
                  style: { boxShadow: "inset 0 0 15px #333" },
                }
              : true
        }
        placement={variant === "placement" ? "top" : undefined}
        gap={variant === "gap" ? { offset: [12, 12], radius: 16 } : undefined}
        indicatorsRender={
          variant === "indicator"
            ? (current, total) => (
                <span>
                  {current + 1} / {total}
                </span>
              )
            : undefined
        }
        actionsRender={
          variant === "actions"
            ? (actions, info) => (
                <div style={{ display: "flex", gap: 8 }}>
                  {info.current < info.total - 1 && (
                    <Button size="small" onClick={() => setOpen(false)}>
                      跳过
                    </Button>
                  )}
                  {actions}
                </div>
              )
            : undefined
        }
      />
    </>
  );
}

export function NonModalDemo() {
  return <ExampleTour variant="non-modal" />;
}

export function PlacementDemo() {
  return <ExampleTour variant="placement" />;
}

export function MaskDemo() {
  return <ExampleTour variant="mask" />;
}

export function IndicatorDemo() {
  return <ExampleTour variant="indicator" />;
}

export function ActionsDemo() {
  return <ExampleTour variant="actions" />;
}

export function GapDemo() {
  return <ExampleTour variant="gap" />;
}
