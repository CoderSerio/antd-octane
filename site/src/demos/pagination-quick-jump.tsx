import { Pagination, Space } from "antd-octane";
import { useState } from "octane";

export function QuickJumpDemo() {
  const [current, setCurrent] = useState(1);
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Pagination
        total={500}
        current={current}
        onChange={setCurrent}
        showQuickJumper
        showSizeChanger={false}
      />
      <p aria-live="polite">
        第 {current} 页；输入页码后按 Enter，或移开焦点提交。
      </p>
    </Space>
  );
}
