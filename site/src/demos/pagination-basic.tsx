import type { PaginationProps } from "antd-octane";
import { Pagination } from "antd-octane";
import { useState } from "octane";

export function BasicDemo() {
  const [current, setCurrent] = useState(3);

  const onChange: PaginationProps["onChange"] = (page) => {
    console.log(page);
    setCurrent(page);
  };

  return <Pagination current={current} onChange={onChange} total={50} />;
}
