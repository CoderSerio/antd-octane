# Form 源码支持范围

本页描述未发布源码能力，npm alpha.7 尚不包含嵌套 NamePath、dependencies 和字段级操作。现有生产站点继续展示已发布版本。

`name`、`getFieldValue`、`setFieldValue` 接受 `string | number | (string | number)[]`。字符串 `"user.name"` 是完整的字面键，嵌套字段写作 `["user", "name"]`。数字路径段在缺少容器时创建数组；字符串数字段创建对象键。数字路径段（包括顶层数字字段）必须是 0 到 4294967294 的整数。已有数组仅接受数字索引或其规范字符串形式（如 `"0"`），不接受 `"length"`、`"01"` 等附加属性；普通对象仍可使用这些字符串键。空路径、非字符串/数字路径段、越界/非整数索引，以及 `__proto__`、`constructor`、`prototype` 路径段不受支持，会抛出错误。

```tsx
const [form] = Form.useForm();
<Form form={form} initialValues={{ user: { email: "" } }}>
  <Form.Item name={["user", "email"]} rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</Form>;
form.setFieldValue(["user", "email"], "ada@example.com");
await form.validateFields(["user"]);
form.resetFields([["user", "email"]]);
```

- `initialValues` 在挂载/更换 Form 实例时建立初始快照，之后改 prop 不会重新初始化。使用 `setFieldsValue` 更新数据；`resetFields` 回到原快照。
- `setFieldsValue` 递归合并普通对象，数组整体替换；`setFieldValue` 精确替换一个路径。读取结果与写入数据的普通对象/数组会复制，避免修改调用方数据。Dayjs、File 等类实例保留身份；数据须无循环引用。
- `validateFields(names?)` 校验指定路径及其已注册后代；成功返回所选数据子树（省略参数返回所有值）。错误中的 `name` 保留注册时的字符串/数字/数组形状。局部校验保留其它字段的错误。
- `resetFields(names?)` 恢复所选子树并清理关联错误，省略参数恢复全部。它不会重新挂载控件或触发 `onValuesChange`。不存在的初始字段恢复为 `undefined`。
- `dependencies` 是 NamePath 数组，例如 `dependencies={[["account", "password"]]}`。相关路径经控件或实例方法更新时，依赖项使用最新值重新校验；自定义 validator 可通过 `form.getFieldValue` 读取依赖。只处理直接声明的依赖，不推导依赖链。重置不启动新的校验。
- 异步提交或后台校验在字段修改、重置、规则结构变化、卸载后不能覆盖新结果。过期的 `validateFields` 以 `outOfDate: true` 拒绝；底层 Promise 不会被取消。行内 validator 回调更新不使正在执行的校验自动失效，下一次校验使用最新回调。
- 未挂载字段保留值，卸载时注销规则并清除错误。当前没有 Form.List、useWatch、字段状态查询、scrollToField、validateTrigger 配置或完整上游校验规则集。

## 自定义控件

Form.Item 默认注入 `value`/`onChange`。DatePicker 的 Dayjs 值、TreeSelect 的 key/keys 都可直接放在嵌套路径。未设置的默认 `value` 注入空字符串；这些源码控件接受此空值。需要其它空值语义时用 `getValueProps` 显式映射。

Upload 使用 `valuePropName="fileList"` 和 `getValueFromEvent={(info) => info.fileList}`；Checkbox/Switch 使用 `valuePropName="checked"`。`getValueProps` 可替代默认映射，`trigger` 可指定其它回调。原控件回调仍会调用。控件编辑触发的 `onValuesChange(changed, all)` 返回嵌套结构；实例方法更新不触发此回调。Form 不会替 Upload 配置服务器请求。

回归证据见 `tests/form-paths.test.tsx`、`tests/form-mapping-validation.test.tsx` 和 `tests/browser/form-paths.html`。浏览器夹具使用源码，不是已发布 npm 消费证明。
