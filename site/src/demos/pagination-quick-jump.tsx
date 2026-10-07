import type { PaginationProps } from "antd-octane";
import { Pagination } from "antd-octane";

const onChange: PaginationProps["onChange"] = (pageNumber) => {
  console.log("Page: ", pageNumber);
};

export function QuickJumpDemo() {
  return (
    <>
      <Pagination
        showQuickJumper
        defaultCurrent={2}
        total={500}
        onChange={onChange}
      />
      <br />
      <Pagination
        showQuickJumper
        defaultCurrent={2}
        total={500}
        onChange={onChange}
        disabled
      />
    </>
  );
}
