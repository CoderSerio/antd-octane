import { AutoComplete, ConfigProvider, Flex } from "antd-octane";

const options = [{ value: "Octane" }, { value: "Ant Design" }];
export function AutoCompleteStatesDemo() {
  return (
    <Flex vertical gap={12} style={{ alignItems: "flex-start" }}>
      <ConfigProvider componentSize="large">
        <AutoComplete
          options={options}
          aria-label="大号建议输入"
          placeholder="继承大号尺寸"
          style={{ width: "min(100%, 280px)" }}
        />
      </ConfigProvider>
      <AutoComplete
        options={options}
        size="small"
        status="warning"
        aria-label="小号警告建议输入"
        placeholder="小号警告"
        style={{ width: "min(100%, 280px)" }}
      />
      <AutoComplete
        options={options}
        status="error"
        aria-label="错误建议输入"
        placeholder="错误状态"
        style={{ width: "min(100%, 280px)" }}
      />
      <ConfigProvider componentDisabled>
        <AutoComplete
          options={options}
          defaultValue="继承禁用"
          aria-label="禁用建议输入"
          style={{ width: "min(100%, 280px)" }}
        />
      </ConfigProvider>
      <AutoComplete
        options={options}
        readOnly
        defaultValue="只读内容"
        aria-label="只读建议输入"
        style={{ width: "min(100%, 280px)" }}
      />
    </Flex>
  );
}
