import { AutoComplete, Flex } from "antd-octane";
export function AutoCompleteBasicDemo() {
  return (
    <Flex vertical gap={12} style={{ alignItems: "flex-start" }}>
      <AutoComplete
        defaultValue="自定义内容"
        options={[
          { value: "Octane" },
          { value: "Ant Design" },
          { value: "暂不可选", disabled: true },
        ]}
        aria-label="自由输入项目名"
        style={{ width: "min(100%, 280px)" }}
      />
      <p>可以输入任意内容，建议列表不是可选值的限制。</p>
    </Flex>
  );
}
