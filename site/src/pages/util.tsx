import { Code, usePageAnchor } from "../docs-ui";

export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Util <span>工具类</span>
      </h1>
      <p className="lead">辅助开发，提供一些常用的工具方法。</p>
      <h2 id="get-ref">GetRef</h2>
      <p>
        获取组件的 <code>ref</code> 属性定义，这对于未直接暴露或者子组件的{" "}
        <code>ref</code> 属性定义非常有用。
      </p>
      <Code
        source={
          'import { Select } from "antd-octane";\nimport type { GetRef } from "antd-octane";\n\ntype SelectRefType = GetRef<typeof Select>;'
        }
      />
      <h2 id="get-props">GetProps</h2>
      <p>
        获取组件的 <code>props</code> 属性定义：
      </p>
      <Code
        source={
          'import { Checkbox } from "antd-octane";\nimport type { GetProps } from "antd-octane";\n\ntype CheckboxGroupType = GetProps<typeof Checkbox.Group>;'
        }
      />
      <h2 id="get-prop">GetProp</h2>
      <p>
        获取组件的单个 <code>props</code> 属性定义。它已经将{" "}
        <code>NonNullable</code> 进行了封装，所以不用再考虑为空的情况：
      </p>
      <Code
        source={
          'import { Select } from "antd-octane";\nimport type { GetProp, SelectProps } from "antd-octane";\n\ntype SelectOptionType1 = GetProp<SelectProps, "options">[number];\ntype SelectOptionType2 = GetProp<typeof Select, "options">[number];'
        }
      />
    </>
  );
}
