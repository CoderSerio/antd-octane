import { Pagination } from "antd-octane";

export function SimpleDemo() {
  return (
    <>
      <Pagination simple defaultCurrent={2} total={50} />
      <br />
      <Pagination disabled simple defaultCurrent={2} total={50} />
    </>
  );
}
