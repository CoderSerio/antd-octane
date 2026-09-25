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
