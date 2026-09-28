import { Pagination, Space } from "antd-octane";

export function TotalDemo() {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Pagination
        total={85}
        showSizeChanger={false}
        showTotal={(total) => `共 ${total} 条`}
      />
      <Pagination
        total={85}
        defaultPageSize={20}
        showSizeChanger={false}
        showTotal={(total, range) => `${range[0]}–${range[1]} / ${total} 条`}
      />
    </Space>
  );
}
