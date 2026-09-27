import { BasicDemo } from "../demos/form-basic";
import { InstanceDemo } from "../demos/form-instance";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";

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
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="填写并提交"
          description="Input、Select 与 Checkbox 共用一份表单状态；错误提交会聚焦首个字段。"
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
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
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
            "校验失败时收到 values 与 errorFields",
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
            "同步校验规则",
            "{ required?, min?, max?, pattern?, message? }[]",
            "[]",
          ],
          [
            "Form.Item.valuePropName",
            "布尔控件使用 checked",
            "value | checked",
            "value",
          ],
          ["Form.Item.help / extra", "帮助说明与补充信息", "OctaneNode", "—"],
          [
            "FormInstance",
            "读取/设置值、重置与校验",
            "getFieldValue, getFieldsValue, setFieldsValue, resetFields, validateFields",
            "—",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        支持范围
      </h2>
      <p>
        当前支持字符串字段名、直接子组件、同步的必填/字符串长度/正则规则；提交时校验，错误字段变化时重新校验。Input、Select、Checkbox
        和 Switch 已验证。Checkbox、Switch 需设置{" "}
        <code>valuePropName="checked"</code>。
      </p>
      <p>
        暂不支持嵌套字段路径、Form.List、字段依赖、异步规则、自定义值转换、完整的校验触发配置或完整
        Ant Design Form API。直接子组件以外的复合控件布局也尚未验证。
      </p>
      <p>
        Form.Item 的必填规则目前不会自动为子控件设置必填语义。使用 Input
        时请同时设置 <code>required</code>；Select 暂未开放
        <code>aria-required</code> 属性，相关辅助技术支持仍待补齐。
      </p>
    </>
  );
}
