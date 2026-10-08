import { ArrayMappingDemo } from "../demos/form-array-mapping";
import { AsyncValidationDemo } from "../demos/form-async-validation";
import { BasicDemo } from "../demos/form-basic";
import { CustomTriggerDemo } from "../demos/form-custom-trigger";
import { InstanceDemo } from "../demos/form-instance";
import { FormLayoutDemo } from "../demos/form-layout";
import { NestedDemo } from "../demos/form-nested";
import { FormValidationDemo } from "../demos/form-validation";
import { ValuePropsDemo } from "../demos/form-value-props";
import { ApiTable, Code, Demo, DocMeta, usePageAnchor } from "../docs-ui";

export default function FormPage({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Form <span>表单</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">收集字段与嵌套数据，在提交时校验并反馈错误。</p>
      <DocMeta name="Form" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        多个输入项需要统一收集、同步或异步校验和提交时使用。简单筛选栏可使用
        inline 布局；嵌套字段使用数组形式的 NamePath。
      </p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="填写并提交"
          description="Input、Select 与 Checkbox 共用一份表单状态；未过期的错误提交会聚焦首个字段。"
          source={() => import("../demos/form-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="instance"
          title="实例方法"
          description="通过 Form.useForm 获取实例，设置值或重置到 initialValues。"
          source={() => import("../demos/form-instance.tsx?raw")}
        >
          <InstanceDemo />
        </Demo>
        <Demo
          id="validation"
          title="手动校验与字段变化"
          description="多条同步规则按顺序检查；validateFields 返回 Promise，失败时提供 errorFields。"
          source={() => import("../demos/form-validation.tsx?raw")}
        >
          <FormValidationDemo />
        </Demo>
        <Demo
          id="layout"
          title="三种排列方式"
          description="切换 horizontal、vertical、inline；Form.Item 可提供 help 和 extra。"
          source={() => import("../demos/form-layout.tsx?raw")}
        >
          <FormLayoutDemo />
        </Demo>
        <Demo
          id="async-validation"
          title="异步用户名校验"
          description="等待 Promise 校验完成后才提交；输入或规则变化时旧校验会标记 outOfDate，不覆盖新错误。"
          source={() => import("../demos/form-async-validation.tsx?raw")}
        >
          <AsyncValidationDemo />
        </Demo>
        <Demo
          id="array-mapping"
          title="绑定数组属性"
          description="通过 valuePropName 绑定自定义控件的 targetKeys；初值、必填和重置都保留数组类型。"
          source={() => import("../demos/form-array-mapping.tsx?raw")}
        >
          <ArrayMappingDemo />
        </Demo>
        <Demo
          id="custom-trigger"
          title="自定义事件与多参数"
          description="trigger 指定收集事件，getValueFromEvent 把数量范围事件的两个参数转换为字段值。"
          source={() => import("../demos/form-custom-trigger.tsx?raw")}
        >
          <CustomTriggerDemo />
        </Demo>
        <Demo
          id="value-props"
          title="存储值与显示值"
          description="金额以分存储、以元显示；getValueProps 控制注入属性，getValueFromEvent 转回存储单位。"
          source={() => import("../demos/form-value-props.tsx?raw")}
        >
          <ValuePropsDemo />
        </Demo>
        <Demo
          id="nested"
          title="嵌套字段与依赖校验"
          description="修改邮箱会重新校验确认字段；实例方法可更新单个路径或重置子树。"
          source={() => import("../demos/form-nested.tsx?raw")}
        >
          <NestedDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "Form.initialValues",
            "挂载或更换实例时建立初始快照；重置时恢复",
            "Record<string, unknown>",
            "{}",
          ],
          [
            "Form.form",
            "由 Form.useForm() 创建的实例",
            "FormInstance",
            "自动创建",
          ],
          ["Form.onFinish", "校验通过后收到字段值", "(values) => void", "—"],
          [
            "Form.onFinishFailed",
            "校验失败或过期时收到当前 values、errorFields；过期结果含 outOfDate: true",
            "(error) => void",
            "—",
          ],
          [
            "Form.onValuesChange",
            "用户更改字段时调用",
            "(changed, all) => void",
            "—",
          ],
          [
            "Form.layout",
            "表单排列方式",
            "horizontal | vertical | inline",
            "horizontal",
          ],
          [
            "Form.Item.name / label",
            "字段路径与标签；字符串中的点不表示嵌套",
            "NamePath / OctaneNode",
            "—",
          ],
          [
            "Form.Item.dependencies",
            "依赖路径变化后重新校验；只处理直接依赖",
            "NamePath[]",
            "[]",
          ],
          [
            "Form.Item.rules",
            "内建同步规则与自定义同步/异步规则",
            "{ required?, min?, max?, pattern?, message?, validator? }[]",
            "[]",
          ],
          [
            "Form.Item.required",
            "显示必填标记；未指定 rules 时也执行必填校验",
            "boolean",
            "false",
          ],
          [
            "Form.Item.valuePropName",
            "指定接收字段值的属性；布尔控件用 checked，数组控件可用 targetKeys",
            "string",
            "value",
          ],
          [
            "Form.Item.trigger",
            "收集字段值的子控件事件；保留原事件回调",
            "string",
            "onChange",
          ],
          [
            "Form.Item.getValueFromEvent",
            "同步转换收集事件的所有参数",
            "(...args) => unknown",
            "提取首参数或 event.target[valuePropName]",
          ],
          [
            "Form.Item.getValueProps",
            "由存储值生成子控件属性；优先于 valuePropName",
            "(value) => Record<string, unknown>",
            "—",
          ],
          [
            "FormRule.validator",
            "抛出错误或拒绝 Promise 表示失败；message 可覆盖错误文本",
            "(rule, value) => void | Promise<void>",
            "—",
          ],
          ["Form.Item.help / extra", "帮助说明与补充信息", "OctaneNode", "—"],
          [
            "Form.id / name / autoComplete",
            "透传原生 form 属性；id/name 也用于生成字段 ID",
            "string",
            "—",
          ],
        ]}
      />
      <h2 id="instance-api" tabIndex={-1}>
        FormInstance 方法
      </h2>
      <p>
        通过 Form.useForm() 获得实例。NamePath
        为字符串、数字或路径数组；局部操作接受
        NamePath[]，不接受上游额外的校验配置对象。
      </p>
      <ApiTable
        headers={["方法", "说明", "签名", "返回"]}
        rows={[
          [
            "getFieldValue",
            "读取一个字段",
            "(name: NamePath) => unknown",
            "字段值",
          ],
          [
            "getFieldsValue",
            "读取所有存储值；普通对象与数组会复制",
            "() => FormValues",
            "字段记录",
          ],
          [
            "setFieldsValue",
            "递归合并普通对象、整体替换数组；不触发 onValuesChange",
            "(values: FormValues) => void",
            "—",
          ],
          [
            "setFieldValue",
            "精确替换一个字段路径；不触发 onValuesChange",
            "(name: NamePath, value: unknown) => void",
            "—",
          ],
          [
            "resetFields",
            "恢复指定子树及关联错误；省略参数重置全部，不重挂载控件",
            "(names?: NamePath[]) => void",
            "—",
          ],
          [
            "validateFields",
            "校验指定路径及其注册后代；省略参数校验全部",
            "(names?: NamePath[]) => Promise<FormValues>",
            "通过时返回值；失败或过期时拒绝",
          ],
        ]}
      />
      <Code
        language="ts"
        source={`type NamePath = string | number | (string | number)[];
type FormValues = Record<string, unknown>;
interface FormValidationError {
  values: FormValues;
  errorFields: { name: NamePath; errors: string[] }[];
  outOfDate?: boolean;
}`}
      />
      <p>
        validateFields 拒绝时返回上述错误对象。outOfDate 为 true
        表示结果已过期，不能用于覆盖当前界面错误。validateFields(names)
        返回所选数据子树；getFieldsValue 不支持字段筛选参数。字符串 "user.name"
        是字面键，嵌套字段应写作 ["user",
        "name"]。数字段创建数组；路径不能为空， 不接受
        __proto__、constructor、prototype 或无效数组索引。
      </p>
      <h2 id="scope" tabIndex={-1}>
        支持范围
      </h2>
      <p>
        支持 NamePath、单个直接子组件、必填/字符串或数组长度/正则规则，以及返回
        Promise 的自定义
        validator。提交时校验全部已注册字段；已有错误字段及直接依赖项
        在相关值变化时重新校验。尚未提供 validateTrigger 配置。
      </p>
      <p>
        valuePropName 可指定任意属性名；getValueProps 启用后替代默认值属性注入。
        getValueFromEvent 接收 trigger 的完整参数列表，必须同步返回字段值。
        自定义控件应正确处理受控值与事件，并转发 id 或为复合控件提供可访问名称。
        数组字段请用 initialValues 设置数组初值；不根据属性名推断空数组。
      </p>
      <p>
        输入、设置值、重置、真实规则变化或更新的校验请求会使旧校验失效。失效结果
        拒绝 Promise 并带 outOfDate: true，错误不覆盖当前 UI，也不会触发
        onFinish。 调用方处理校验失败时应区分 outOfDate
        与当前字段错误。等价的新规则数组不会取消校验；行内 validator
        回调引用更新不自动使已有校验失效，下一次校验使用最新回调。
      </p>
      <p>
        暂不支持 Form.List、useWatch、字段状态查询、scrollToField、normalize
        和完整 Ant Design Form API。实例方法不触发
        onValuesChange；控件编辑时该回调
        返回嵌套数据。未挂载字段保留值并注销规则。Checkbox、Switch 需设置
        <code>valuePropName="checked"</code>。
      </p>
      <p>
        Form.Item 的必填规则目前不会自动为子控件设置必填语义。使用 Input
        时请同时设置 <code>required</code>；Select 暂未开放
        <code>aria-required</code> 属性，相关辅助技术支持仍待补齐。
      </p>
    </>
  );
}
