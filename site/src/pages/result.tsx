import { ComponentWhenToUse } from "../component-prose";
import {
  ReferenceApiTables,
  ReferenceTokenTable,
} from "../component-reference";
import Demo3 from "../demos/result/403";
import Demo4 from "../demos/result/404";
import Demo5 from "../demos/result/500";
import Demo7 from "../demos/result/customIcon";
import Demo6 from "../demos/result/error";
import Demo1 from "../demos/result/info";
import Demo0 from "../demos/result/success";
import Demo2 from "../demos/result/warning";
import { Demo, DemoGrid, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Result <span>结果</span>
      </h1>
      <p className="lead">用于反馈一系列操作任务的处理结果。</p>
      <DocMeta name="Result" />
      <ComponentWhenToUse component="Result" />
      <h2 id="examples">代码演示</h2>
      <DemoGrid columns={1}>
        <Demo
          id={"success"}
          title={"Success"}
          description={"成功的结果。"}
          descriptionMarkdown
          source={() => import("../demos/result/success.tsx?raw")}
        >
          <Demo0 />
        </Demo>
        <Demo
          id={"info"}
          title={"Info"}
          description={"展示处理结果。"}
          descriptionMarkdown
          source={() => import("../demos/result/info.tsx?raw")}
        >
          <Demo1 />
        </Demo>
        <Demo
          id={"warning"}
          title={"Warning"}
          description={"警告类型的结果。"}
          descriptionMarkdown
          source={() => import("../demos/result/warning.tsx?raw")}
        >
          <Demo2 />
        </Demo>
        <Demo
          id={"403"}
          title={"403"}
          description={"你没有此页面的访问权限。"}
          descriptionMarkdown
          source={() => import("../demos/result/403.tsx?raw")}
        >
          <Demo3 />
        </Demo>
        <Demo
          id={"404"}
          title={"404"}
          description={"此页面未找到。"}
          descriptionMarkdown
          source={() => import("../demos/result/404.tsx?raw")}
        >
          <Demo4 />
        </Demo>
        <Demo
          id={"500"}
          title={"500"}
          description={"服务器发生了错误。"}
          descriptionMarkdown
          source={() => import("../demos/result/500.tsx?raw")}
        >
          <Demo5 />
        </Demo>
        <Demo
          id={"error"}
          title={"Error"}
          description={"复杂的错误反馈。"}
          descriptionMarkdown
          source={() => import("../demos/result/error.tsx?raw")}
        >
          <Demo6 />
        </Demo>
        <Demo
          id={"customIcon"}
          title={"自定义 icon"}
          description={"自定义 icon。"}
          descriptionMarkdown
          source={() => import("../demos/result/customIcon.tsx?raw")}
        >
          <Demo7 />
        </Demo>
      </DemoGrid>
      <h2 id="api">API</h2>
      <ReferenceApiTables component="Result" />
      <h2 id="tokens">主题变量（Design Token）</h2>
      <ReferenceTokenTable component="Result" />
    </>
  );
}
