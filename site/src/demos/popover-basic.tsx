import { Button, Popover, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  return (
    <Space wrap>
      <Popover
        title="项目说明"
        content="可选择并复制这里的文字。移入浮层后可以继续阅读。"
        trigger={["hover", "focus"]}
      >
        <Button>悬停或聚焦</Button>
      </Popover>
      <Popover
        title="更多信息"
        content="点击外部或按 Escape 关闭。"
        trigger="click"
      >
        <Button>点击打开</Button>
      </Popover>
    </Space>
  );
}
export function MoreDemo() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <Space wrap>
      <Popover
        open={open}
        onOpenChange={setOpen}
        trigger="click"
        title="保存项目"
        content={
          <div>
            <p>将当前草稿保存到本次演示状态。</p>
            <Button
              type="primary"
              onClick={() => {
                setSaved(true);
                setOpen(false);
              }}
            >
              确认保存
            </Button>
          </div>
        }
      >
        <Button>打开操作面板</Button>
      </Popover>
      <span aria-live="polite">{saved ? "草稿已保存" : "草稿尚未保存"}</span>
    </Space>
  );
}
