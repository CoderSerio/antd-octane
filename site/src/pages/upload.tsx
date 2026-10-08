import { BasicDemo } from "../demos/upload-basic";
import { DraggerDemo } from "../demos/upload-dragger";
import { ApiTable, Demo, DocMeta, usePageAnchor } from "../docs-ui";
export default function Page({ section }: { section?: string }) {
  usePageAnchor(section);
  return (
    <>
      <h1>
        Upload <span>上传</span>
        <small>Alpha</small>
      </h1>
      <p className="lead">管理文件选择、列表和可取消的上传请求。</p>
      <DocMeta name="Upload" />
      <h2 id="when" tabIndex={-1}>
        何时使用
      </h2>
      <p>
        需要拦截文件、显示进度并处理成功或失败的场景。本页示例全部在浏览器内模拟，不发送或保存文件。
      </p>
      <h2 id="examples" tabIndex={-1}>
        代码演示
      </h2>
      <div className="demo-grid">
        <Demo
          id="basic"
          title={"受控列表与请求生命周期"}
          description={
            "customRequest 模拟进度、成功和失败，abort 清理计时器；文件名含 fail 时失败。"
          }
          source={() => import("../demos/upload-basic.tsx?raw")}
        >
          <BasicDemo />
        </Demo>
        <Demo
          id="dragger"
          title={"拖放、数量限制与移除规则"}
          description={
            "Dragger 阻止浏览器文件导航，maxCount 截断列表；LIST_IGNORE 排除超大文件，onRemove 可否决。"
          }
          source={() => import("../demos/upload-dragger.tsx?raw")}
        >
          <DraggerDemo />
        </Demo>
      </div>
      <h2 id="api" tabIndex={-1}>
        API
      </h2>
      <p>
        以下为本页使用的支持子集。完整类型以安装包声明为准，不直接照搬上游未实现属性。
      </p>
      <ApiTable
        rows={[
          [
            "fileList / defaultFileList / onChange",
            "受控或初始列表；变化含 file、fileList 和可选 event",
            "UploadFile[] / UploadFile[] / (info) => void",
            "— / [] / —",
          ],
          [
            "accept / multiple",
            "扩展名或 MIME 过滤 / 多选",
            "string / boolean",
            "— / false",
          ],
          [
            "maxCount",
            "正整数；1 替换，其他值保留已有项并截断新增",
            "number",
            "不限",
          ],
          [
            "beforeUpload",
            "false 仅入列；LIST_IGNORE 忽略；可异步转换 File/Blob",
            "(file, batch) => result | Promise<result>",
            "—",
          ],
          [
            "action / name / data / headers / withCredentials",
            "默认 POST FormData 请求设置",
            "string / string / maps / boolean",
            "— / file / — / false",
          ],
          [
            "customRequest",
            "实现传输，使用 progress/success/error 回调；可返回 abort",
            "(options) => { abort() } | void",
            "默认 XHR",
          ],
          [
            "onRemove",
            "false 或 Promise<false> 否决；异常同样否决",
            "(file) => boolean | void | Promise",
            "允许",
          ],
          [
            "showUploadList / disabled / children",
            "显示列表 / 禁用 / 自定义触发内容",
            "boolean / boolean / OctaneNode",
            "true / provider / 原生按钮",
          ],
          [
            "Upload.Dragger",
            "继承 Upload API，另有 height、onDrop",
            "UploadDraggerProps",
            "—",
          ],
        ]}
      />
      <h2 id="scope" tabIndex={-1}>
        行为与支持范围
      </h2>
      <p>
        {
          "实际业务需提供可用 action 或 customRequest。accept 和文件大小示例只是客户端规则，服务器必须另做验证和授权；组件不提供上传服务。"
        }
      </p>
      <p>
        {
          "受控父组件须接受 onChange.fileList；拒绝新增时不会发请求，拒绝 maxCount=1 替换时保留原请求。被接受的移除、替换和卸载会取消在途请求并忽略迟到回调。"
        }
      </p>
      <p>
        {
          "maxCount>1 的超额项仍经过 beforeUpload，但不入列也不发请求；false 占列表名额，LIST_IGNORE 不占。只改 maxCount 不会截断已传入的列表。新单文件选择会使旧的异步拦截结果失效。"
        }
      </p>
      <p>
        {
          "Dragger 支持 Enter/Space 与拖放，disabled 阻止选择和拖放请求。目录、粘贴、缩略图、preview、listType、itemRender、重试界面和异步 action/data 尚未实现。每个文件须有稳定唯一 uid。"
        }
      </p>
    </>
  );
}
