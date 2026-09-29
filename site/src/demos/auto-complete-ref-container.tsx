import { AutoComplete, type AutoCompleteRef, Button, Flex } from "antd-octane";
import { useRef } from "octane";
export function AutoCompleteRefContainerDemo() {
  const ref = useRef<AutoCompleteRef | null>(null);
  return (
    <Flex vertical gap={12} style={{ alignItems: "flex-start" }}>
      <Flex gap={8}>
        <Button onClick={() => ref.current?.focus()}>聚焦输入</Button>
        <Button onClick={() => ref.current?.blur()}>移开焦点</Button>
      </Flex>
      <div style={{ position: "relative", width: "min(100%, 280px)" }}>
        <AutoComplete
          ref={ref}
          options={[{ value: "Octane" }, { value: "Ant Design" }]}
          getPopupContainer={(trigger) =>
            trigger.parentElement ?? document.body
          }
          aria-label="局部浮层建议输入"
          placeholder="点击或向下键打开"
          style={{ width: "100%" }}
        />
      </div>
      <p>浮层挂到输入框外层容器。ref 暴露输入元素、外层元素和 focus/blur。</p>
    </Flex>
  );
}
