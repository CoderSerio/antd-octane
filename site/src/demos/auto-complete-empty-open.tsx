import { AutoComplete, Button, Flex } from "antd-octane";
import { useState } from "octane";
export function AutoCompleteEmptyOpenDemo() {
  const [open, setOpen] = useState(true);
  const [hasOptions, setHasOptions] = useState(false);
  return (
    <Flex vertical gap={12} style={{ alignItems: "flex-start" }}>
      <Flex gap={8} wrap="wrap">
        <Button onClick={() => setHasOptions(!hasOptions)}>
          {hasOptions ? "移除建议" : "补入建议"}
        </Button>
        <Button onClick={() => setOpen(!open)}>
          {open ? "关闭" : "请求展开"}
        </Button>
      </Flex>
      <AutoComplete
        options={
          hasOptions ? [{ value: "Octane" }, { value: "Ant Design" }] : []
        }
        open={open}
        onOpenChange={setOpen}
        aria-label="受控展开建议输入"
        style={{ width: "min(100%, 280px)" }}
      />
      <p>
        请求展开：{String(open)}；建议数量：{hasOptions ? 2 : 0}。即便
        open=true，空列表也不显示浮层。
      </p>
    </Flex>
  );
}
