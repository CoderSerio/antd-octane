import { Skeleton, Spin } from "antd-octane";

export function Loading({ code = false }: { code?: boolean }) {
  return (
    <div
      className={code ? "code-loading" : "page-loading"}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-label">
        <Spin size={code ? "small" : "large"} />
        <span>{code ? "正在加载代码…" : "正在加载文档…"}</span>
      </div>
      <div className="loading-skeleton" aria-hidden="true">
        <Skeleton active title={!code} paragraph={{ rows: code ? 3 : 5 }} />
      </div>
    </div>
  );
}
