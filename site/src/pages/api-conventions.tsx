import { Code, usePageAnchor } from "../docs-ui";
export default function ApiConventions({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>API 与语法约定</h1>
      <p className="lead">
        沿用熟悉的 antd 业务 API，框架语法以 Octane 0.4.3 为准。
      </p>
      <h2 id="state" tabIndex={-1}>
        状态与受控输入
      </h2>
      <p>
        使用 <code>useState</code>，向 value 传当前值。onChange
        在每次输入时触发，可直接读取 event.target.value。
      </p>
      <Code
        source={
          'import { useState } from "octane";\nimport { Input } from "antd-octane";\n\nexport function Example() {\n  const [value, setValue] = useState("");\n  return <Input value={value} onChange={(e) => setValue(e.target.value)} />;\n}'
        }
      />
      <p>
        defaultValue 与 defaultChecked
        只设置初始值。不在挂载后混用受控和非受控模式。
      </p>
      <h2 id="refs" tabIndex={-1}>
        ref 与原生事件
      </h2>
      <p>
        useRef 返回的对象通过 .current 访问组件实例。Input 提供
        focus、blur、select、input 和 nativeElement。
      </p>
      <Code
        source={
          "const inputRef = useRef<InputRef | null>(null);\n<Input ref={inputRef} />\n<Button onClick={() => inputRef.current?.focus()}>聚焦</Button>"
        }
      />
      <p>
        Input 使用原生输入事件，不提供 SyntheticEvent 或 persist。Checkbox
        的回调提供 target.checked 与 nativeEvent。异步使用前先保存需要的值。
      </p>
      <h2 id="planned" tabIndex={-1}>
        后续 API 的边界
      </h2>
      <p>
        Form.rules 计划保留数组；Modal.confirm 与 hook/holder
        双入口仍是后续方向。Table 的 render
        回调需要单独验证闭包和更新行为，目前未实现这些组件。
      </p>
      <div className="notice">
        <strong>早期讨论的修正</strong>
        <p>
          早期方案中的 createSignal、直接 ref.focus()
          和“组件只运行一次”不适用于本项目锁定的 Octane 版本。本文使用已验证的
          Hooks 与 .current 写法。
        </p>
      </div>
    </>
  );
}
