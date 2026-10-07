import type { PaginationProps } from "antd-octane";
import { Pagination } from "antd-octane";

const showTotal: PaginationProps["showTotal"] = (total) =>
  `Total ${total} items`;

export function MiniDemo() {
  return (
    <>
      <Pagination style={{ marginBottom: 24 }} size="small" total={50} />
      <Pagination
        style={{ marginBottom: 24 }}
        size="small"
        total={50}
        showSizeChanger
        showQuickJumper
      />
      <Pagination
        style={{ marginBottom: 24 }}
        size="small"
        total={50}
        showTotal={showTotal}
      />
      <Pagination
        size="small"
        total={50}
        disabled
        showTotal={showTotal}
        showSizeChanger
        showQuickJumper
      />
    </>
  );
}
