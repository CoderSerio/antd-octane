import { Input, Radio, type RadioValue, Space } from "antd-octane";
import { useState } from "octane";

export function RadioVerticalDemo() {
  const [value, setValue] = useState<RadioValue>("daily");
  const [other, setOther] = useState("");
  return (
    <Space direction="vertical">
      <Radio.Group
        aria-label="发送频率"
        name="frequency"
        value={value}
        onChange={(event) => setValue(event.target.value ?? "daily")}
        style={{ display: "grid", gap: 12 }}
      >
        <Radio value="daily">每天</Radio>
        <Radio value="weekly">每周</Radio>
        <Radio value="other">其他频率</Radio>
      </Radio.Group>
      <Input
        aria-label="其他发送频率"
        placeholder="请输入频率说明"
        disabled={value !== "other"}
        value={other}
        onChange={(event) => setOther(event.target.value)}
      />
      <span role="status">
        频率：
        {value === "other"
          ? other || "待填写"
          : value === "daily"
            ? "每天"
            : "每周"}
      </span>
    </Space>
  );
}
