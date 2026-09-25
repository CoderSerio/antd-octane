import { BasicDemo, MoreDemo } from "../demos/breadcrumb-basic";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Breadcrumb <span>面包屑</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">显示当前页面在信息层级中的位置。</p>
      <DocMeta name="Breadcrumb" />
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title="层级导航"
          description="通过真实链接返回项目介绍或组件目录。"
          source={() => import("../demos/breadcrumb-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="more"
          title="自定义分隔符"
          description="按钮用于切换本地工作区域，当前项随之更新。"
          source={() => import("../demos/breadcrumb-basic.tsx?raw")}
        >
          <MoreDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <ApiTable
        rows={[
          ["items", "导航条目", "BreadcrumbItem[]", "[]"],
          ["separator", "默认分隔符", "OctaneNode", "/"],
          [
            "items[].title / href / onClick",
            "内容、链接或本地操作",
            "OctaneNode / string / callback",
            "—",
          ],
          [
            "items[].separator / type",
            "条目分隔符 / 独立分隔符",
            "OctaneNode / separator",
            "—",
          ],
        ]}
      />
      <h2 id="tokens" tabIndex={-1}>
        主题与支持范围
      </h2>
      <p>
        支持
        itemColor、lastItemColor、linkColor、linkHoverColor、separatorColor、separatorMargin
        token。items 的菜单、旧版 routes / children 和 itemRender
        尚未提供；链接使用浏览器原生导航。
      </p>
    </>
  );
}
