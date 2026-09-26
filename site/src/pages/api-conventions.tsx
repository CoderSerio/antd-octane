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
        Form 与 Table 仍待专项实现，Form.rules 与 Table render
        的适配需另行验证。Modal 已提供声明式
        open/onOk/onCancel；Modal.confirm、Modal.useModal
        尚未支持。消息与通知可使用 hook/holder 或 App.useApp()
        实例，不能照搬全局静态调用。
      </p>
      <div className="notice">
        <strong>Octane 版本约定</strong>
        <p>
          本文示例面向 Octane 0.4.3，状态使用 Hooks，ref 通过 .current
          读取。迁移代码时请同时核对 Octane 版本和组件类型声明。
        </p>
      </div>
    </>
  );
}
