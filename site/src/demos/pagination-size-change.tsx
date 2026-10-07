import type { PaginationProps } from "antd-octane";
import { Pagination } from "antd-octane";

const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
  current,
  pageSize,
) => {
  console.log(current, pageSize);
};

export function SizeChangeDemo() {
  return (
    <>
      <Pagination
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        defaultCurrent={3}
        total={500}
      />
      <br />
      <Pagination
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        defaultCurrent={3}
        total={500}
        disabled
      />
    </>
  );
}
