import { ArrayMappingDemo } from "../demos/form-array-mapping";
import { AsyncValidationDemo } from "../demos/form-async-validation";
import { BasicDemo } from "../demos/form-basic";
import { CustomTriggerDemo } from "../demos/form-custom-trigger";
import { InstanceDemo } from "../demos/form-instance";
import { FormLayoutDemo } from "../demos/form-layout";
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
      <p className="lead">收集平面字段的值，在提交时校验并反馈错误。</p>
      <DocMeta name="Form" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        多个输入项需要统一收集、同步或异步校验和提交时使用。简单筛选栏可使用
        inline 布局；当前只支持平面字段。
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
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          [
            "Form.disabled",
            "设置表单组件禁用；仅对 antd-octane 组件有效",
            "boolean",
            "false",
          ],
          [
            "Form.size",
            "设置字段组件的尺寸；仅对 antd-octane 组件有效",
            "small | middle | large",
            "—",
          ],
          [
            "Form.initialValues",
            "初始字段值；重置时恢复",
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
            "平面字段名与标签",
            "string / OctaneNode",
            "—",
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
        通过 Form.useForm()
        获得实例。字段名仅支持字符串；下列为完整签名，不接受上游额外的字段列表或校验配置参数。
      </p>
      <ApiTable
        headers={["方法", "说明", "签名", "返回"]}
        rows={[
          [
            "getFieldValue",
            "读取一个字段",
            "(name: string) => unknown",
            "字段值",
          ],
          [
            "getFieldsValue",
            "读取所有存储值的浅拷贝",
            "() => FormValues",
            "字段记录",
          ],
          [
            "setFieldsValue",
            "合并字段值；不触发 onValuesChange",
            "(values: FormValues) => void",
            "—",
          ],
          [
            "resetFields",
            "重置全部字段到 initialValues 并清除错误；不触发 onValuesChange",
            "() => void",
            "—",
          ],
          [
            "validateFields",
            "校验所有已注册字段",
            "() => Promise<FormValues>",
            "通过时返回值；失败或过期时拒绝",
          ],
        ]}
      />
      <Code
        language="ts"
        source={`type FormValues = Record<string, unknown>;
interface FormValidationError {
  values: FormValues;
  errorFields: { name: string; errors: string[] }[];
  outOfDate?: boolean;
}`}
      />
      <p>
        validateFields 拒绝时返回上述错误对象。outOfDate 为 true
        表示结果已过期，不能用于覆盖当前界面错误。resetFields
        不支持只重置部分字段；getFieldsValue 不支持字段筛选参数。
      </p>
      <h2 id="scope" tabIndex={-1}>
        支持范围
      </h2>
      <p>
        当前支持字符串字段名、单个直接子组件、必填/字符串或数组长度/正则规则，以及返回
        Promise 的自定义 validator。提交或 validateFields
        时运行全部规则；已有错误字段 在值变化时重新校验。尚未提供完整的
        validateTrigger 配置。
      </p>
      <p>
        valuePropName 可指定任意属性名；getValueProps 启用后替代默认值属性注入。
        getValueFromEvent 接收 trigger 的完整参数列表，必须同步返回字段值。
        自定义控件应正确处理受控值与事件，并转发 id 或为复合控件提供可访问名称。
        数组字段请用 initialValues 设置数组初值；不根据属性名推断空数组。
      </p>
      <p>
        disabled 与 size 通过上下文传递，未设置时继承父级配置；显式
        disabled=false 可覆盖父级禁用。ConfigProvider.useConfig() 读取当前生效的
        componentDisabled 与 componentSize。
      </p>
      <p>
        未发布源码已补 Form 与 Form.Item 的 prefixCls、rootClassName、colon，
        Form.Item 可覆盖 layout。标签、必填标记、help / extra 间距及三种基本布局
        参考 antd 5.29.3，支持全部 10 个 Form 组件 Token 的嵌套覆盖。 Form.Item
        独立使用时也解析组件主题。labelCol / wrapperCol
        网格布局、可配置响应式列及校验动效仍未提供。
      </p>
      <p>
        输入、设置值、重置、真实规则变化或更新的校验请求会使旧校验失效。失效结果
        拒绝 Promise 并带 outOfDate: true，错误不覆盖当前 UI，也不会触发
        onFinish。 调用方处理校验失败时应区分 outOfDate
        与当前字段错误。等价的新规则数组不会 取消校验；validator
        函数引用变化视为规则变化，异步 validator 宜保持引用稳定。
      </p>
      <p>
        暂不支持嵌套字段路径、Form.List、dependencies、normalize、完整的校验触发配置
        或完整 Ant Design Form API。setFieldsValue 与 resetFields 不触发
        onValuesChange。 Input、Select、Checkbox 和 Switch
        已验证；Checkbox、Switch 需设置
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
