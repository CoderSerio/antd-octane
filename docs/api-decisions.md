# API 与语法决策

状态：实现中的约定。验证基线为 Octane 0.4.3、Ant Design 5.29.3。

本文件恢复早期讨论的逐项记录，并根据锁定版本修正示例。RFC 说明项目方向，本文件约束开发者实际书写的代码；具体支持范围见 [兼容清单](compatibility.md)。

## 原则

组件名、业务 props、事件的使用方式、组合 API 和主题结构尽量延续 antd；状态、生命周期、ref 与事件底层机制遵循固定版本的 Octane。优先保持高频业务 API 熟悉，不为内部实现方式另造一套业务 API。初始化与构建配置若有差异，应集中说明。

## D-001 / D-007：ref 访问和组件实例

**已验证，修正早期假设。** Octane 0.4.3 提供 `useRef`，引用通过 `.current` 访问。组件暴露 `focus()`、`blur()`、`nativeElement` 等明确的方法与 DOM 入口，支持对象和回调 ref。不要把 ref 本身当成实例调用 `ref.focus()`。

```tsx
import { useRef } from "octane";
import { Button, type ButtonRef } from "antd-octane";

function Example() {
  const ref = useRef<ButtonRef | null>(null);
  return <Button ref={ref} onClick={() => ref.current?.focus()}>聚焦</Button>;
}
```

卸载后对象 ref 应归零；具体实例成员按组件声明。Input 另提供 `input` 和 `select()`。早期“不要 `.current`”的意见基于错误的框架假设，已经撤回。

## D-002：受控值与状态

**已验证，修正早期假设。** 使用 Octane 的 `useState`；`value` 传当前值，`checked` 传布尔值。这里没有约定 `createSignal`，也不把 accessor 函数当作 value。不要承诺组件函数只执行一次。

```tsx
const [value, setValue] = useState("");
<Input value={value} onChange={(event) => setValue(event.target.value)} />
```

受控值由调用方决定；`defaultValue` / `defaultChecked` 只用于初始非受控状态。一个组件生命周期内不要切换受控与非受控模式。输入法组合期间允许原生 input 事件，不以组合中的 Enter 提交。

## D-003：输入事件

**实现约定。** Input 的 `onChange` 在每次原生 input 事件时调用，保留用户熟悉的逐次输入行为；底层提供原生事件，`event.target.value` 可用，不实现 React SyntheticEvent 或 `persist()`。只有组件做此映射，原生 `<input onChange>` 仍遵循浏览器 change 事件。

Checkbox 的 `onChange` 提供 `target.checked`、`target.value`、`nativeEvent` 和阻止默认行为/传播的方法。不要把事件对象保存后再读取原生 `currentTarget`；异步逻辑应先保存需要的值。

## D-004：Form.rules

**保留方向，未实现。** 继续以 antd 的数组格式为目标：`rules={[{ required: true }, { validator }]}`，不要求使用函数返回规则。早期以“组件只运行一次、validator 读取 signal”为理由的推导不成立。实施 Form 前需验证动态规则、依赖字段、异步校验竞争与最新状态闭包。

## D-005：命令式 API

**保留方向，未实现。** 保留 `Modal.confirm`、`message.success`、`notification.open` 等静态入口，以及能承接当前 context 的 hook/holder 用法。静态 root 不应被描述为自动继承任意页面 Provider。实施前明确挂载点、销毁、重复调用、主题/语言作用域、键盘和焦点恢复；先建立共享浮层能力。

## D-006：ConfigProvider 对象配置

**已验证。** `theme` 直接接收对象，以 `useState` 切换算法或 token，支持嵌套继承和 `inherit: false`。不要求消费者改用函数或 signal 包装主题；内置算法从本库导入。`useMemo` 可用于减少不必要的新对象，不能成为正确性前提。

## TODO-001：render props 与闭包

**尚未验证。** Table 的 `columns.render` 等回调要验证外部状态变化、回调身份、列表重排与 keyed 节点复用。早期提出的自动包裹、显式 accessor、额外 useReactive 均不是已接受 API。先对固定编译器做可复现实验，再决定是否需要适配，不在没有证据时增加语法。

## 变更规则

每次更改以上约定，需要同步组件类型、示例、行为测试和兼容清单。未完成项保留为待验证，不写成“已支持”。旧稿中的框架假设与实现状态以本文件为准。
