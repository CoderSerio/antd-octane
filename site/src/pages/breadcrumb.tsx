import { BasicDemo, MoreDemo } from "../demos/breadcrumb-basic";
import { IconsDemo } from "../demos/breadcrumb-icons";
import { PathNavigationDemo } from "../demos/breadcrumb-path-navigation";
import { SeparatorItemsDemo } from "../demos/breadcrumb-separator-items";
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
        <Demo
          id="path-navigation"
          title="路径下钻"
          description="进入下级时追加当前位置，点击前面的面包屑可返回对应层级。"
          source={() => import("../demos/breadcrumb-path-navigation.tsx?raw")}
        >
          <PathNavigationDemo />
        </Demo>
        <Demo
          id="icons"
          title="带有图标"
          description="title 接受 OctaneNode，图标可放在文字前；装饰图标不重复朗读。"
          source={() => import("../demos/breadcrumb-icons.tsx?raw")}
        >
          <IconsDemo />
        </Demo>
        <Demo
          id="separator-items"
          title="独立分隔符"
          description="type=separator 为每个层级设置不同的分隔符。"
          source={() => import("../demos/breadcrumb-separator-items.tsx?raw")}
        >
          <SeparatorItemsDemo />
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
            "items[].key / className",
            "稳定键值 / 条目类名",
            "string | number / string",
            "—",
          ],
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
        token。仅传 onClick
        的条目渲染为按钮，适合应用内切换；最后一项标记为当前页面。items 的
        menu、dropdownProps、path 拼接、params、旧版 routes / children 和
        itemRender 尚未提供；链接使用浏览器原生导航。
      </p>
    </>
  );
}
