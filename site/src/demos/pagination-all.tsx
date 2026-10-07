import { Pagination } from "antd-octane";

export function AllDemo() {
  return (
    <Pagination
      total={85}
      showSizeChanger
      showQuickJumper
      showTotal={(total) => `Total ${total} items`}
    />
  );
}
