import { AutoComplete, Button, Flex } from "antd-octane";
import { useState } from "octane";
export function AutoCompleteControlledDemo() {
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  return (
    <Flex vertical gap={12} style={{ alignItems: "flex-start" }}>
      <AutoComplete
        value={value}
        onChange={setValue}
        onSearch={setSearch}
        onSelect={setSelected}
        options={[
          { value: "octane", label: "Octane 官方站" },
          { value: "antd", label: "Ant Design 官方站" },
        ]}
        allowClear
        aria-label="受控项目名"
        style={{ width: "min(100%, 280px)" }}
      />
      <Button onClick={() => setValue("来自应用的值")}>外部设置值</Button>
      <p>
        当前值：{value || "空"}；最近搜索：{search || "空"}；最近选项：
        {selected || "未选择"}
      </p>
    </Flex>
  );
}
