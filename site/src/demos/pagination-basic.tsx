import { Pagination, Space } from "antd-octane";
import { useState } from "octane";
export function BasicDemo() {
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState(10);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Pagination
        total={238}
        current={current}
        pageSize={size}
        showQuickJumper
        showTotal={(total, range) => `${range[0]}–${range[1]} / ${total} 条`}
        onChange={(page, perPage) => {
          setCurrent(page);
          setSize(perPage);
        }}
      />
      <p aria-live="polite">
        第 {current} 页，每页 {size} 条。
      </p>
    </Space>
  );
}
export function MoreDemo() {
  return (
    <Space direction="vertical">
      <Pagination size="small" total={50} />
      <Pagination simple total={120} showSizeChanger={false} />
      <Pagination disabled total={50} />
    </Space>
  );
}
