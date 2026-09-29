import { Pagination, Space } from "antd-octane";
import { useState } from "octane";

export function SizeChangeDemo() {
  const [message, setMessage] = useState("尚未改变每页条数");
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Pagination
        total={500}
        showSizeChanger
        pageSizeOptions={[10, 20, 50]}
        onShowSizeChange={(current, size) =>
          setMessage(`第 ${current} 页，每页 ${size} 条`)
        }
      />
      <p aria-live="polite">{message}</p>
    </Space>
  );
}
