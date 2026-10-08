import { BasicDemo, MoreDemo } from "../demos/util-types";
import { ApiTable, Code, Demo, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Util <span>类型工具</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">
        从 Octane 组件提取 props、单个属性和 ref 实例类型，减少重复声明。
      </p>
      <Code
        source={'import type { GetProps, GetProp, GetRef } from "antd-octane";'}
      />
      <p>
        这些是编译期类型，不存在可调用的 Util 运行时对象。以下示例的类型约束由
        TypeScript 检查，页面仅展示被声明类型的组件。
      </p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="提取 props 和属性"
          description="Button 配置与 size 从组件类型推导，不另写一套属性接口。"
          source={() => import("../demos/util-types.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="提取 ref 实例"
          description="GetRef 提取 Input 暴露的实例，按钮调用真实 focus 方法。"
          source={() => import("../demos/util-types.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        类型 API
      </h2>
      <ApiTable
        rows={[
          [
            "GetProps<T>",
            "组件参数类型；传入 props 对象类型时保留它",
            "T extends object",
            "—",
          ],
          [
            "GetProp<T, K>",
            "GetProps<T> 中 K 对应的非空属性类型",
            "NonNullable<GetProps<T>[K]>",
            "—",
          ],
          [
            "GetRef<T>",
            "组件 ref 暴露的实例类型；无匹配 ref 时为 never",
            "T extends ComponentType<never>",
            "—",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        支持边界
      </h2>
      <p>
        仅处理类型，不做运行时校验、属性转换或 DOM 查找。GetProp 会去掉 null 与
        undefined，业务值仍需按实际 props 的可空性处理。不能把提取的类型当作
        React、Vue
        或任意高阶泛型组件的通用反射协议；复杂泛型组件可直接使用本库导出的专用
        Props 类型。
      </p>
    </>
  );
}
