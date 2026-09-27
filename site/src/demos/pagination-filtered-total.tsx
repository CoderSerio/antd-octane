import { Button, Pagination, Space } from "antd-octane";
import { useState } from "octane";

export function FilteredTotalDemo() {
  const [pendingOnly, setPendingOnly] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const total = pendingOnly ? 9 : 83;

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space wrap>
        <Button
          type={pendingOnly ? "default" : "primary"}
          onClick={() => {
            setPendingOnly(false);
            setCurrent(1);
          }}
        >
          全部（83）
        </Button>
        <Button
          type={pendingOnly ? "primary" : "default"}
          onClick={() => {
            setPendingOnly(true);
            setCurrent(1);
          }}
        >
          待处理（9）
        </Button>
      </Space>
      <Pagination
        total={total}
        current={current}
        pageSize={pageSize}
        showSizeChanger
        showLessItems
        showTotal={(count, range) => `${range[0]}–${range[1]} / ${count} 条`}
        onChange={(next, size) => {
          setCurrent(next);
          setPageSize(size);
        }}
      />
      <p aria-live="polite">
        当前第 {current} 页，每页 {pageSize} 条。切换筛选时回到第一页。
      </p>
    </Space>
  );
}
