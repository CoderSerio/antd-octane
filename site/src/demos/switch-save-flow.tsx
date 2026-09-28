import { Button, Space, Switch } from "antd-octane";
import { useState } from "octane";

export function SwitchSaveFlowDemo() {
  const [checked, setChecked] = useState(false);
  const [pending, setPending] = useState<boolean | null>(null);
  return (
    <Space direction="vertical">
      <Space>
        <Switch
          aria-label="公开项目"
          checked={checked}
          loading={pending !== null}
          onChange={setPending}
        />
        <span role="status">
          {pending !== null
            ? "等待保存结果"
            : checked
              ? "项目已公开"
              : "项目未公开"}
        </span>
      </Space>
      <Space wrap>
        <Button
          disabled={pending === null}
          onClick={() => {
            if (pending !== null) setChecked(pending);
            setPending(null);
          }}
        >
          模拟保存成功
        </Button>
        <Button disabled={pending === null} onClick={() => setPending(null)}>
          模拟保存失败
        </Button>
      </Space>
    </Space>
  );
}
