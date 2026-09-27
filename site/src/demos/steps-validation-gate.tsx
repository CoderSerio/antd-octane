import { Button, Checkbox, Space, Steps } from "antd-octane";
import { useState } from "octane";

const items = [
  { title: "填写资料" },
  { title: "确认条款", description: "必须确认后才能完成" },
  { title: "完成" },
];

export function ValidationGateDemo() {
  const [current, setCurrent] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState(false);
  const goTo = (next: number) => {
    if (next === 2 && !accepted) {
      setError(true);
      return;
    }
    setError(false);
    setCurrent(next);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Steps
        current={current}
        status={error ? "error" : "process"}
        items={items}
        onChange={goTo}
      />
      <Checkbox
        checked={accepted}
        onChange={(event) => {
          setAccepted(event.target.checked);
          if (event.target.checked) setError(false);
        }}
      >
        我已阅读并确认条款
      </Checkbox>
      <Space wrap>
        <Button disabled={current === 0} onClick={() => goTo(current - 1)}>
          上一步
        </Button>
        <Button
          type="primary"
          disabled={current === 2}
          onClick={() => goTo(current + 1)}
        >
          下一步
        </Button>
      </Space>
      <p aria-live="polite">
        {error
          ? "请先确认条款。"
          : current === 2
            ? "已完成。"
            : "可以继续操作。"}
      </p>
    </Space>
  );
}
