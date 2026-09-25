import { Input } from "antd-octane";
import { useState } from "octane";
export function InputControlledDemo() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState("");
  return (
    <div className="input-examples">
      <Input
        value={value}
        allowClear
        onChange={(event) => setValue(event.target.value)}
        onPressEnter={() => setSubmitted(value)}
        placeholder="输入后按 Enter"
        aria-label="受控输入"
      />
      <span>
        当前值：<output>{value || "—"}</output>
      </span>
      <span aria-live="polite">已提交：{submitted || "—"}</span>
    </div>
  );
}
